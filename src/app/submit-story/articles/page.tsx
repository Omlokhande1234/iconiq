"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, ChevronRight } from "lucide-react";

const sectionConfig: Record<string, { name: string; eyebrow: string; description: string; placeholder: string }> = {
  "cover-stories": { name: "Cover Stories", eyebrow: "PREMIUM EDITORIAL", description: "Tell us about the leader, company, or story you believe deserves a deeper editorial spotlight.", placeholder: "Write your story or editorial proposal..." },
  articles: { name: "Articles", eyebrow: "EDITORIAL SUBMISSION", description: "Submit an original business, technology, leadership, or industry article for editorial consideration.", placeholder: "Write or paste your article..." },
  magazines: { name: "Magazines", eyebrow: "MAGAZINE SUBMISSION", description: "Submit your story, profile, feature idea, or company perspective for consideration in an upcoming edition.", placeholder: "Write your magazine submission..." },
  podcasts: { name: "Podcasts", eyebrow: "PODCAST SUBMISSION", description: "Tell us about the person, topic, or conversation you would like to bring to ICONIQ SPHERE.", placeholder: "Tell us about the proposed podcast conversation..." },
  news: { name: "News", eyebrow: "NEWS SUBMISSION", description: "Submit a timely company, product, business, or industry announcement for editorial review.", placeholder: "Write your news submission..." },
};


function ReviewSection({
  number, title, subtitle, onEdit, children,
}: {
  number: string;
  title: string;
  subtitle: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="story-review-section">
      <div className="story-review-heading">
        <div>
          <span>{number}</span>
          <div><strong>{title}</strong><p>{subtitle}</p></div>
        </div>
        <button type="button" onClick={onEdit}>Edit</button>
      </div>
      {children}
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><small>{label}</small><p>{value || "—"}</p></div>;
}

export default function SubmitStorySectionPage() {
  const params = useParams<{ section: string }>();
  const section = sectionConfig.articles;
  const [submitted, setSubmitted] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    title: "",
    content: "",
    source: "",
  });

  if (submitted) {
    return (
      <main className="story-form-page">
        <div className="story-form-shell story-review-shell">
          <Link href="/submit-your-story" className="story-form-back">
            <ArrowLeft size={14} /> Back to sections
          </Link>

          <div className="story-form-header">
            <div>
              <span className="story-form-kicker">03 / REVIEW SUBMISSION</span>
              <h1>Review your<br /><em>Article.</em></h1>
              <p>
                Check your information and article before seeing the submission fee
                and continuing to payment.
              </p>
            </div>
            <div className="story-form-progress">
              <span className="progress-done">01</span><span />
              <span className="progress-done">02</span><span />
              <span className="progress-active">03</span>
            </div>
          </div>

          <div className="story-review-grid">
            <div>
              <ReviewSection number="01" title="About you" subtitle="Your contact information" onEdit={() => setSubmitted(false)}>
                <div className="story-review-details">
                  <Detail label="Full name" value={formData.name} />
                  <Detail label="Email address" value={formData.email} />
                  <Detail label="Company / organisation" value={formData.company} />
                  <Detail label="Phone number" value={formData.phone} />
                </div>
              </ReviewSection>

              <ReviewSection number="02" title="Your article" subtitle="Content submitted for editorial consideration" onEdit={() => setSubmitted(false)}>
                <div className="story-review-content">
                  <small>Article title</small>
                  <h2>{formData.title || "Untitled article"}</h2>
                  <div className="story-review-divider" />
                  <small>Content</small>
                  <div className="story-review-body">{formData.content || "—"}</div>
                  {formData.source && (
                    <>
                      <div className="story-review-divider" />
                      <small>Supporting link</small>
                      <a href={formData.source} target="_blank" rel="noreferrer" className="story-review-link">
                        {formData.source}
                      </a>
                    </>
                  )}
                </div>
              </ReviewSection>

              <ReviewSection number="03" title="Images" subtitle="Supporting images selected for your article" onEdit={() => setSubmitted(false)}>
                <div className="story-review-images">
                  {images.length ? images.map((image, index) => (
                    <div className="story-review-image-item" key={`${image.name}-${image.size}-${index}`}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{image.name}</strong>
                    </div>
                  )) : (
                    <p className="story-review-empty">No images selected.</p>
                  )}
                </div>
              </ReviewSection>
            </div>

            <aside className="story-review-sidebar">
              <div className="story-review-price">
                <span className="story-form-kicker">FINAL STEP</span>
                <h2>Submission fee</h2>
                <p>The applicable fee is shown here before you continue to Skydo for payment.</p>

                <div className="story-review-price-row">
                  <div>
                    <span>Articles submission</span>
                    <small>Editorial submission fee</small>
                  </div>
                  <strong>₹999</strong>
                </div>

                <button
                  type="button"
                  className="primary-action story-review-payment"
                  onClick={() => {
                    const paymentLink = process.env.NEXT_PUBLIC_SKYDO_ARTICLES_PAYMENT_LINK;
                    if (!paymentLink) {
                      alert("Skydo payment link is not configured yet.");
                      return;
                    }
                    window.location.href = paymentLink;
                  }}
                >
                  Proceed to payment <ArrowUpRight size={16} />
                </button>

                <p className="story-review-note">
                  You will be redirected to Skydo to complete payment. Payment does
                  not guarantee publication; every submission remains subject to
                  editorial review and approval.
                </p>
              </div>

              <button type="button" className="story-review-back" onClick={() => setSubmitted(false)}>
                <ArrowLeft size={14} /> Back to edit
              </button>
            </aside>
          </div>

          <div className="story-form-footnote">
            <span />
            <p>Your submission remains subject to editorial review and approval before publication.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="story-form-page">
      <div className="story-form-shell">
        <Link href="/submit-story" className="story-form-back"><ArrowLeft size={14} /> Back to sections</Link>

        <div className="story-form-header">
          <div>
            <span className="story-form-kicker">02 / {section.eyebrow}</span>
            <h1>Submit to<br /><em>{section.name}.</em></h1>
            <p>{section.description}</p>
          </div>
          <div className="story-form-progress"><span className="progress-active">01</span><span /><span>02</span><span /><span>03</span></div>
        </div>

        <form
          className="story-form"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            setFormData({
              name: String(data.get("name") ?? ""),
              email: String(data.get("email") ?? ""),
              company: String(data.get("company") ?? ""),
              phone: String(data.get("phone") ?? ""),
              title: String(data.get("title") ?? ""),
              content: String(data.get("content") ?? ""),
              source: String(data.get("source") ?? ""),
            });
            setSubmitted(true);
          }}
        >
          <div className="story-form-section">
            <div className="story-form-section-title"><span>01</span><div><strong>About you</strong><p>Tell our editorial team who is making the submission.</p></div></div>
            <div className="story-form-fields">
              <label><span>Full name</span><input required name="name" placeholder="Your full name" /></label>
              <label><span>Email address</span><input required name="email" type="email" placeholder="you@example.com" /></label>
              <label><span>Company / organisation</span><input name="company" placeholder="Company or organisation" /></label>
              <label><span>Phone number</span><input name="phone" type="tel" placeholder="+91" /></label>
            </div>
          </div>

          <div className="story-form-section">
            <div className="story-form-section-title"><span>02</span><div><strong>Your story</strong><p>Provide the content and context for our editorial team.</p></div></div>
            <div className="story-form-fields story-form-fields-single">
              <label><span>Story title</span><input required name="title" placeholder="Give your story a clear title" /></label>
              <label>
                <span>Content</span>
                <textarea
                  required
                  name="content"
                  rows={16}
                  placeholder={section.placeholder}
                />
                <small>
                  There is no word limit. Submit as much content as your story
                  requires.
                </small>
              </label>

              <label>
                <span>Images <i>Optional · Multiple images allowed</i></span>
                <div className="story-image-upload">
                  <input
                    id="story-images"
                    name="images"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={(event) => {
                      setImages(Array.from(event.target.files ?? []));
                    }}
                  />

                  <label htmlFor="story-images" className="story-image-dropzone">
                    <ArrowUpRight size={17} />
                    <span>Choose images</span>
                    <small>JPG, PNG or WEBP · Select multiple images</small>
                  </label>

                  {images.length > 0 && (
                    <div className="story-image-list">
                      {images.map((image, index) => (
                        <div
                          className="story-image-item"
                          key={`${image.name}-${image.size}-${index}`}
                        >
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          <strong>{image.name}</strong>
                          <button
                            type="button"
                            onClick={() =>
                              setImages((current) =>
                                current.filter((_, i) => i !== index)
                              )
                            }
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <small>
                  Select as many images as needed. Upload/storage limits will
                  be configured when the backend is connected.
                </small>
              </label>

              <label><span>Supporting link <i>Optional</i></span><input name="source" type="url" placeholder="https://" /></label>
            </div>
          </div>

          <div className="story-form-section story-form-final">
            <div className="story-form-section-title"><span>03</span><div><strong>Final details</strong><p>One last detail before your submission is reviewed.</p></div></div>
            <label className="story-form-checkbox"><input required type="checkbox" /><span>I confirm that the information submitted is accurate and that I have the right to submit this content for editorial consideration.</span></label>
          </div>

          <div className="story-form-submit-bar">
            <div><span>READY TO CONTINUE?</span><p>You will review the submission and applicable fee before payment.</p></div>
            <button type="submit" className="primary-action">Continue to review <ArrowUpRight size={16} /></button>
          </div>
        </form>

        <div className="story-form-footnote"><span /><p>Your submission remains subject to editorial review and approval before publication.</p></div>
      </div>

      <style jsx global>{`
        .story-form-page { min-height:100vh; background:#fff; color:#11113f; font-family:var(--font-inter),sans-serif; }
        .story-form-page h1,.story-form-page h2,.story-form-page strong,.story-form-page button { font-family:var(--font-manrope),sans-serif; }
        .story-form-shell { width:min(1040px,calc(100% - 64px)); margin:0 auto; padding:30px 0 75px; }
        .story-form-back { display:inline-flex; align-items:center; gap:7px; color:#5d6075; font-size:10px; font-weight:600; }
        .story-form-back:hover { color:#24105f; }
        .story-form-header { display:flex; align-items:flex-end; justify-content:space-between; gap:50px; padding:62px 0 52px; border-bottom:1px solid #e5e5ed; }
        .story-form-kicker { color:#382080; font-size:9px; font-weight:800; letter-spacing:1.5px; }
        .story-form-header h1 { margin:17px 0 16px; font-size:clamp(43px,6vw,66px); line-height:1; letter-spacing:-2.5px; font-weight:750; }
        .story-form-header h1 em,.story-form-success h1 em { color:#24105f; font-family:Georgia,serif; font-weight:400; }
        .story-form-header p,.story-form-success>p { max-width:590px; margin:0; color:#5d6075; font-size:13px; line-height:1.75; }
        .story-form-progress { display:flex; align-items:center; gap:8px; padding-bottom:8px; flex-shrink:0; }
        .story-form-progress span:not(:nth-child(even)) { color:#a1a2af; font-size:8px; font-weight:800; }
        .story-form-progress .progress-active { color:#24105f!important; }
        .story-form-progress span:nth-child(even) { width:25px; height:1px; background:#e5e5ed; }
        .story-form-section { padding:38px 0; border-bottom:1px solid #e5e5ed; }
        .story-form-section-title { display:grid; grid-template-columns:42px 260px; gap:16px; margin-bottom:27px; }
        .story-form-section-title>span { color:#c8a951; font-size:9px; font-weight:800; letter-spacing:1px; padding-top:3px; }
        .story-form-section-title strong { display:block; font-size:15px; font-weight:750; }
        .story-form-section-title p { margin:5px 0 0; color:#85889a; font-size:10px; line-height:1.5; }
        .story-form-fields { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:19px 22px; padding-left:58px; }
        .story-form-fields-single { grid-template-columns:1fr; }
        .story-form-fields label { display:flex; flex-direction:column; gap:8px; }
        .story-form-fields label>span { color:#11113f; font-size:10px; font-weight:700; }
        .story-form-fields label>span i { color:#a0a1ae; font-style:normal; font-weight:500; }
        .story-form-fields input,.story-form-fields textarea { width:100%; border:1px solid #e5e5ed; border-radius:6px; outline:0; background:#fff; color:#11113f; font-family:var(--font-inter),sans-serif; font-size:12px; transition:border-color .2s ease,box-shadow .2s ease; }
        .story-form-fields input { height:44px; padding:0 13px; }
        .story-form-fields textarea { min-height:250px; padding:13px; resize:vertical; line-height:1.7; }
        .story-form-fields input:focus,.story-form-fields textarea:focus { border-color:#382080; box-shadow:0 0 0 3px rgba(56,32,128,.06); }
        .story-form-fields input::placeholder,.story-form-fields textarea::placeholder { color:#b0b1bd; }
        .story-image-upload { display:flex; flex-direction:column; gap:10px; }
        .story-image-upload > input { position:absolute; width:1px; height:1px; opacity:0; pointer-events:none; }
        .story-image-dropzone { min-height:92px; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:5px; border:1px dashed #d9d8e3; border-radius:7px; background:#fafafd; color:#24105f; cursor:pointer; }
        .story-image-dropzone:hover { border-color:#382080; background:#f7f7fa; }
        .story-image-dropzone > span { font-family:var(--font-manrope),sans-serif; font-size:11px; font-weight:750; }
        .story-image-dropzone small { margin:0; color:#85889a; font-size:9px; }
        .story-image-list { display:flex; flex-direction:column; border:1px solid #e5e5ed; border-radius:6px; overflow:hidden; }
        .story-image-item { min-height:38px; display:grid; grid-template-columns:28px minmax(0,1fr) auto; align-items:center; gap:9px; padding:6px 10px; border-bottom:1px solid #e5e5ed; background:#fff; }
        .story-image-item:last-child { border-bottom:0; }
        .story-image-item > span { color:#c8a951; font-size:8px; font-weight:800; }
        .story-image-item strong { min-width:0; overflow:hidden; color:#5d6075; font-family:var(--font-inter),sans-serif; font-size:10px; font-weight:600; text-overflow:ellipsis; white-space:nowrap; }
        .story-image-item button { border:0; background:transparent; color:#85889a; font-family:var(--font-inter),sans-serif; font-size:9px; }
        .story-image-item button:hover { color:#24105f; }

        .story-form-fields small { margin-top:-2px; color:#85889a; font-size:9px; line-height:1.5; }
        .story-form-final { border-bottom:0; padding-bottom:28px; }
        .story-form-checkbox { display:flex; align-items:flex-start; gap:10px; margin-left:58px; color:#5d6075; font-size:10px; line-height:1.6; }
        .story-form-checkbox input { width:15px; height:15px; margin:0; accent-color:#24105f; }
        .story-form-submit-bar { display:flex; align-items:center; justify-content:space-between; gap:30px; padding:20px 22px; border-radius:8px; background:#11113f; color:#fff; }
        .story-form-submit-bar>div>span { color:#c8a951; font-size:8px; font-weight:800; letter-spacing:1.2px; }
        .story-form-submit-bar p { margin:5px 0 0; color:#b9bac9; font-size:10px; }
        .primary-action { min-height:40px; display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:0 14px; border:0; border-radius:6px; background:#c8a951; color:#11113f; font-size:9px; font-weight:800; letter-spacing:.5px; text-transform:uppercase; text-decoration:none; white-space:nowrap; }
        .primary-action:hover { background:#d2b664; }
        .story-form-footnote { display:flex; align-items:center; gap:10px; margin-top:19px; }
        .story-form-footnote>span { width:24px; height:1px; background:#c8a951; }
        .story-form-footnote p { margin:0; color:#85889a; font-size:9px; }
        .story-form-success { min-height:80vh; display:flex; flex-direction:column; justify-content:center; }
        .success-mark { width:43px; height:43px; display:inline-flex; align-items:center; justify-content:center; margin-bottom:22px; border-radius:50%; background:#f7f7fa; color:#24105f; }
        .story-form-success h1 { margin:17px 0; font-size:clamp(43px,6vw,65px); line-height:1; letter-spacing:-2.5px; }
        .success-actions { display:flex; align-items:center; gap:15px; margin-top:30px; }
        .secondary-action { display:inline-flex; align-items:center; gap:7px; min-height:40px; padding:0 12px; color:#5d6075; font-size:10px; font-weight:700; }
        @media(max-width:720px){ .story-form-shell{width:calc(100% - 30px);padding-top:22px}.story-form-header{display:block;padding:48px 0 38px}.story-form-header h1{font-size:47px}.story-form-progress{margin-top:28px}.story-form-section{padding:30px 0}.story-form-section-title{grid-template-columns:32px 1fr}.story-form-fields{grid-template-columns:1fr;padding-left:48px}.story-form-checkbox{margin-left:48px}.story-form-submit-bar{align-items:flex-start;flex-direction:column}.primary-action{width:100%}.success-actions{flex-direction:column;align-items:stretch} }
      `}</style>
    </main>
  );
}
