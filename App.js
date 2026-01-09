import React, { useState } from 'react';
import { Upload, Zap, Download, Loader, CheckCircle, Star, ArrowRight } from 'lucide-react';

export default function ResumeOptimizer() {
  const [page, setPage] = useState('home'); // home, app, contact
  const [text, setText] = useState('');
  const [docType, setDocType] = useState('resume');
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeDocument = async () => {
    if (!text.trim()) {
      setError('Please paste your resume or cover letter');
      return;
    }

    setLoading(true);
    setError(null);
    setSuggestions(null);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `You are an expert resume and cover letter optimizer. Analyze this ${docType} and provide ONLY a JSON response with NO other text. Return exactly this structure:
{
  "score": <number 0-100>,
  "strengths": [<3-4 specific strengths>],
  "improvements": [<4-5 specific actionable improvements>],
  "keywords": [<5-7 industry keywords to add>],
  "summary": "<1 sentence overall assessment>"
}

${docType}:
${text}`
            }
          ]
        })
      });

      const data = await response.json();
      const content = data.content[0].text;
      const jsonText = content.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(jsonText);
      setSuggestions(parsed);
    } catch (err) {
      setError('Failed to analyze document. Try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadOptimized = () => {
    const content = `OPTIMIZATION REPORT - ${docType.toUpperCase()}\n\n` +
      `Score: ${suggestions.score}/100\n\n` +
      `Summary: ${suggestions.summary}\n\n` +
      `Strengths:\n${suggestions.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n` +
      `Improvements:\n${suggestions.improvements.map((imp, i) => `${i + 1}. ${imp}`).join('\n')}\n\n` +
      `Keywords to Add:\n${suggestions.keywords.join(', ')}\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docType}_optimization_report.txt`;
    a.click();
  };

  // HOME PAGE
  if (page === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-indigo-600" />
              <span className="font-bold text-xl text-gray-900">ResumeBoost</span>
            </div>
            <div className="flex gap-6">
              <button onClick={() => setPage('home')} className="text-gray-700 hover:text-indigo-600 font-medium">Home</button>
              <button onClick={() => setPage('app')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">Try Free</button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Get Hired Faster with AI
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Let artificial intelligence analyze your resume and cover letter. Get actionable feedback in seconds, not hours.
            </p>
          </div>
          <button
            onClick={() => setPage('app')}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition"
          >
            Start Optimizing Free <ArrowRight className="w-5 h-5" />
          </button>
        </section>

        {/* Features */}
        <section className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why ResumeBoost?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Instant Analysis',
                  desc: 'Get results in seconds. No waiting, no emails.',
                  icon: '⚡'
                },
                {
                  title: 'AI-Powered',
                  desc: 'Advanced AI knows what recruiters want to see.',
                  icon: '🤖'
                },
                {
                  title: 'Actionable Tips',
                  desc: 'Specific improvements you can implement right now.',
                  icon: '🎯'
                },
                {
                  title: 'Keyword Suggestions',
                  desc: 'Stand out with industry-relevant keywords.',
                  icon: '🔑'
                },
                {
                  title: 'Score & Feedback',
                  desc: 'Get a score and detailed breakdown of your document.',
                  icon: '📊'
                },
                {
                  title: 'Download Report',
                  desc: 'Save your analysis and track improvements over time.',
                  icon: '📥'
                }
              ].map((feature, idx) => (
                <div key={idx} className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition">
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Testimonials</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: 'Sarah M.',
                role: 'Got hired at Google',
                text: 'Improved my resume score from 62 to 89. The keyword suggestions were game-changing!'
              },
              {
                name: 'James K.',
                role: 'Landed 3 interviews',
                text: 'Finally understood what recruiters look for. This tool is a must-have for job seekers.'
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to boost your resume?</h2>
            <p className="text-lg mb-8 opacity-90">It's completely free. No credit card needed.</p>
            <button
              onClick={() => setPage('app')}
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
            >
              Start Your Free Analysis
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-white mb-3">ResumeBoost</h3>
                <p>AI-powered resume optimization for job seekers.</p>
              </div>
              <div>
                <h3 className="font-bold text-white mb-3">Product</h3>
                <ul className="space-y-2">
                  <li><button onClick={() => setPage('app')} className="hover:text-white">Try Free</button></li>
                  <li><button onClick={() => setPage('home')} className="hover:text-white">Features</button></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-white mb-3">Contact</h3>
                <button onClick={() => setPage('contact')} className="hover:text-white">Get in Touch</button>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-sm">
              <p>&copy; 2026 ResumeBoost. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // APP PAGE
  if (page === 'app') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <button
            onClick={() => setPage('home')}
            className="mb-8 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to Home
          </button>

          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-indigo-600" />
              <h1 className="text-4xl font-bold text-gray-900">Resume Optimizer</h1>
            </div>
            <p className="text-gray-600 text-lg">AI-powered analysis to boost your job applications</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* Document Type Selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Document Type</label>
              <div className="flex gap-4">
                {['resume', 'cover letter'].map(type => (
                  <button
                    key={type}
                    onClick={() => setDocType(type)}
                    className={`px-6 py-3 rounded-lg font-medium transition ${
                      docType === type
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Paste your {docType}
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Paste your ${docType} here... The more detailed, the better the analysis.`}
                className="w-full h-64 p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">Min. 200 characters for best results</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                {error}
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={analyzeDocument}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Analyze Now
                </>
              )}
            </button>
          </div>

          {/* Results */}
          {suggestions && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Score */}
              <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl">
                <p className="text-gray-600 text-sm font-medium mb-2">Overall Score</p>
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-indigo-600">{suggestions.score}</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-indigo-600 h-3 rounded-full transition-all"
                        style={{ width: `${suggestions.score}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{suggestions.summary}</p>
                  </div>
                </div>
              </div>

              {/* Strengths */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">✨ Your Strengths</h3>
                <ul className="space-y-3">
                  {suggestions.strengths.map((strength, idx) => (
                    <li key={idx} className="flex gap-3 text-gray-700">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 Improvements</h3>
                <ul className="space-y-3">
                  {suggestions.improvements.map((imp, idx) => (
                    <li key={idx} className="flex gap-3 text-gray-700">
                      <span className="text-orange-600 font-bold">{idx + 1}.</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Keywords */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🔑 Keywords to Add</h3>
                <div className="flex flex-wrap gap-2">
                  {suggestions.keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={downloadOptimized}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Report
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // CONTACT PAGE
  if (page === 'contact') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setPage('home')}
            className="mb-8 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to Home
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h1>
            
            <div className="space-y-6">
              <div>
                <p className="text-gray-700 mb-4">Have questions or feedback? We'd love to hear from you!</p>
              </div>

              <div className="bg-indigo-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Email</h3>
                <p className="text-gray-700">support@resumeboost.com</p>
              </div>

              <div className="bg-indigo-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Twitter</h3>
                <p className="text-gray-700">@resumeboost</p>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Send us a message</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                  <textarea
                    placeholder="Your message"
                    rows="5"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                  <button
                    onClick={() => alert('Thanks for your message!')}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}