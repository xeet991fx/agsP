import React from 'react';
import { Twitter, Github, Heart, Mail, ExternalLink, Sparkles } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-75 blur transition duration-300"></div>
                <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                  <Twitter size={20} className="text-white" />
                </div>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                X Post Generator
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Create engaging X posts instantly with AI-powered content generation. Built for creators, by creators.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
              <span>Made with</span>
              <Heart size={14} className="text-red-500 fill-current animate-pulse" />
              <span>by developers</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <Sparkles size={14} className="group-hover:text-blue-500 transition-colors" />
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#examples" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Examples
                </a>
              </li>
              <li>
                <a href="#faq" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#blog" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#careers" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#docs" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                  Documentation
                  <ExternalLink size={12} className="opacity-50" />
                </a>
              </li>
              <li>
                <a href="#api" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                  API Reference
                  <ExternalLink size={12} className="opacity-50" />
                </a>
              </li>
              <li>
                <a href="#support" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Support
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} X Post Generator. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-900 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-white dark:hover:text-white transition-all"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="mailto:contact@example.com"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Powered By */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center justify-center gap-2">
              <span>Powered by</span>
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Google Gemini AI
              </span>
              <span>•</span>
              <span>Built with React & Express</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
