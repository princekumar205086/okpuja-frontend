import React from "react";

const samplePosts = [
  {
    id: 1,
    title: "How to Book a Puja Online",
    excerpt: "A step-by-step guide to booking your puja with verified pandits.",
  },
  {
    id: 2,
    title: "Astrology Tips for 2024",
    excerpt: "Discover what the stars have in store for you this year.",
  },
  {
    id: 3,
    title: "Top 5 Festivals to Celebrate",
    excerpt: "Explore the most important Hindu festivals and their significance.",
  },
];

const BlogPage = () => (
  <div className="max-w-3xl mx-auto py-10 px-4">
    <h1 className="text-3xl font-bold mb-6">Our Blog</h1>
    <ul className="space-y-6">
      {samplePosts.map((post) => (
        <li key={post.id} className="border-b pb-4">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="text-gray-600">{post.excerpt}</p>
        </li>
      ))}
    </ul>
  </div>
);

export default BlogPage;
