import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getBlogPostBySlug,
  listBlogPosts,
  removeBlogPost,
  saveBlogPost,
} from "../db";
import { storagePut } from "../storage";

const blogStatus = z.enum(["draft", "published"]);

const blogPostInput = z.object({
  id: z.number().int().positive().optional(),
  slug: z.string().trim().min(2).max(220),
  title: z.string().trim().min(2).max(200),
  excerpt: z.string().trim().min(5).max(2000),
  body: z.string().trim().min(10).max(50000),
  authorName: z.string().trim().min(2).max(120),
  coverImageUrl: z.string().trim().max(25000000).nullable().optional(),
  category: z.string().trim().min(2).max(80),
  status: blogStatus,
  publishedAt: z.string().datetime().nullable().optional(),
});

export const blogAdminRouter = router({
  list: adminProcedure.query(async () => {
    return listBlogPosts(true);
  }),

  save: adminProcedure.input(blogPostInput).mutation(async ({ input }) => {
    let coverImageUrl = input.coverImageUrl;
    if (coverImageUrl && coverImageUrl.startsWith("data:")) {
      try {
        const uploaded = await storagePut(`blog/${input.slug || Date.now()}`, coverImageUrl);
        coverImageUrl = uploaded.url;
      } catch (err) {
        console.warn("[Blog] Storage upload fallback:", err);
      }
    }
    return saveBlogPost({
      ...input,
      coverImageUrl,
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : undefined,
    });
  }),

  remove: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return removeBlogPost(input.id);
    }),
});

export const blogPublicRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          limit: z.number().int().min(1).max(50).default(20),
        })
        .optional()
    )
    .query(async ({ input }) => {
      let posts = await listBlogPosts(false);
      if (input?.category) {
        posts = posts.filter(
          (p) => p.category.toLowerCase() === input.category?.toLowerCase()
        );
      }
      return posts.slice(0, input?.limit ?? 20);
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      const post = await getBlogPostBySlug(input.slug);
      if (!post || post.status !== "published") {
        throw new TRPCError({ code: "NOT_FOUND", message: "Blog post not found." });
      }
      return post;
    }),
});

export const blogRouter = blogPublicRouter;

