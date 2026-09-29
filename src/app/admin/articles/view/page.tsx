"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Edit3, Trash2, Eye } from "lucide-react";

const INITIAL_ARTICLES = [
  {
    id: 1,
    category: "BUSINESS",
    title: "Building Businesses That Shape the Future",
    excerpt: "Discover the ideas, strategies and leadership decisions transforming modern business.",
    image: "/article-1.jpg",
    slug: "building-businesses-that-shape-the-future",
  },
  {
    id: 2,
    category: "LEADERSHIP",
    title: "The Leaders Redefining What's Possible",
    excerpt: "Meet the visionary minds creating meaningful impact across industries.",
    image: "/article-2.jpg",
    slug: "the-leaders-redefining-whats-possible",
  },
];

export default function AdminViewArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState(INITIAL_ARTICLES);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this article?")) {
      setArticles(articles.filter((article) => article.id !== id));
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* Header Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#5d6075" }}>
            Content Management
          </span>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#11113f", margin: "4px 0 0 0" }}>
            Articles Dashboard
          </h1>
        </div>

        <Link
          href="/admin/articles/add"
          style={{
            background: "#24105f",
            color: "#ffffff",
            padding: "10px 18px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 700,
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
          }}
        >
          <Plus size={16} /> Add Article
        </Link>
      </div>

      {/* Articles Table Card */}
      <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #e5e5ed", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#f7f7fa", borderBottom: "1px solid #e5e5ed" }}>
              <th style={{ padding: "14px 20px", fontSize: "11px", fontWeight: 700, color: "#5d6075" }}>Frame Preview</th>
              <th style={{ padding: "14px 20px", fontSize: "11px", fontWeight: 700, color: "#5d6075" }}>Category</th>
              <th style={{ padding: "14px 20px", fontSize: "11px", fontWeight: 700, color: "#5d6075" }}>Title & Excerpt</th>
              <th style={{ padding: "14px 20px", fontSize: "11px", fontWeight: 700, color: "#5d6075", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} style={{ borderBottom: "1px solid #e5e5ed" }}>
                <td style={{ padding: "16px 20px", width: "130px" }}>
                  <div style={{ width: "90px", height: "50px", borderRadius: "6px", overflow: "hidden", background: "#eef2f7" }}>
                    <img src={article.image} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <span style={{ background: "#f1eff7", color: "#24105f", padding: "4px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: 700 }}>
                    {article.category}
                  </span>
                </td>
                <td style={{ padding: "16px 20px", maxWidth: "400px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#11113f" }}>{article.title}</div>
                  <div style={{ fontSize: "12px", color: "#5d6075" }}>{article.excerpt}</div>
                </td>
                <td style={{ padding: "16px 20px", textAlign: "right" }}>
                  <button
                    onClick={() => handleDelete(article.id)}
                    style={{ padding: "8px", background: "#fff5f5", borderRadius: "6px", color: "#e53e3e", border: "1px solid #fed7d7", cursor: "pointer" }}
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}