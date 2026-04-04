"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getJobPosting, applyToJob } from "@/services/job_posting.service";
import {
  MapPin,
  DollarSign,
  Calendar,
  Building2,
  Upload,
  CheckCircle,
  XCircle,
  Loader2,
  FileText,
} from "lucide-react";

interface JobPosting {
  position: string;
  company_name: string;
  work_location: string;
  salary_min: number;
  salary_max: number;
  job_description: string;
  deadline_date: string;
  status: string;
}

interface MatchResult {
  message: string;
  score: number;
  verdict: string;
  matched_skills: string[];
  missing_skills: string[];
  explanation: string;
}

export default function JobPostingPage() {
  const params = useParams();
  const token = params.token as string;

  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getJobPosting(token)
      .then((res) => setJob(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile || !fullName || !email) return;

    setSubmitting(true);
    setResult(null);

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("cv", cvFile);

    try {
      const res = await applyToJob(token, formData);
      setResult(res.data);
      setSubmitted(true);
      setSubmitSuccess(res.meta?.status && res.data?.score >= 70);
    } catch {
      setError("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl border p-8 max-w-md text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Job Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{job.position}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              {job.company_name}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {job.work_location}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Deadline: {job.deadline_date}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-gray-900">
              {formatCurrency(job.salary_min)} - {formatCurrency(job.salary_max)}
            </span>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Job Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.job_description}</p>
          </div>
        </div>

        {/* Apply Form or Result */}
        {submitted && result ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="text-center mb-6">
              {submitSuccess ? (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
                  <p className="text-gray-600">Your application has been saved and sent to the recruiter.</p>
                </>
              ) : (
                <>
                  <XCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">CV Analyzed</h2>
                  <p className="text-gray-600">
                    Your CV does not meet the minimum match score (70) for this position.
                    Your application was not submitted.
                  </p>
                </>
              )}
            </div>

            {/* Match Score */}
            <div className="border rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Match Score</span>
                <span
                  className={`text-3xl font-bold ${
                    result.score >= 70 ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {result.score}/100
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    result.score >= 70 ? "bg-green-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${result.score}%` }}
                />
              </div>

              <p className="text-sm font-medium">
                Verdict:{" "}
                <span
                  className={
                    result.verdict === "Strong Match"
                      ? "text-green-600"
                      : result.verdict === "Potential Match"
                      ? "text-amber-600"
                      : "text-red-600"
                  }
                >
                  {result.verdict}
                </span>
              </p>

              <p className="text-gray-700 text-sm">{result.explanation}</p>

              {result.matched_skills?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Matched Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {result.matched_skills.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs border border-green-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.missing_skills?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Missing Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_skills.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs border border-red-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Apply for this position</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload CV <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-pink-400 transition-colors"
                >
                  {cvFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-8 h-8 text-pink-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{cvFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">Click to upload your CV</p>
                      <p className="text-sm text-gray-400 mt-1">PDF, DOCX, DOC, or TXT (max 10MB)</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !fullName || !email || !cvFile}
                className="w-full py-3 px-6 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg font-medium hover:from-pink-700 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing CV & Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
