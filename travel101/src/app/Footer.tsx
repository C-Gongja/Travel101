// components/Footer.tsx
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';

const Footer: React.FC = () => {
	return (
		<footer className="text-black border-t border-gray-200 shadow-[0px_0px_23px_-4px_rgba(0,_0,_0,_0.1)]">
			<div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row justify-between items-start gap-8">
					{/* Logo & Description */}
					<div>
						<h2 className="text-2xl font-bold text-black">Sharavel</h2>
						<p className="mt-2 text-sm max-w-sm">
							Building modern web experiences with speed, accessibility, and great design.
						</p>
					</div>

					{/* Navigation Links */}
					<div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
						<div>
							<h3 className="font-semibold mb-3">Company</h3>
							<ul className="space-y-2">
								<li><Link href="/about" className="hover:text-primary">About</Link></li>
								<li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
								<li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
							</ul>
						</div>

						<div>
							<h3 className="font-semibold mb-3">Resources</h3>
							<ul className="space-y-2">
								<li><Link href="/docs" className="hover:text-primary">Docs</Link></li>
								<li><Link href="/guides" className="hover:text-primary">Guides</Link></li>
								<li><Link href="/api" className="hover:text-primary">API</Link></li>
							</ul>
						</div>

						<div>
							<h3 className="font-semibold mb-3">Support</h3>
							<ul className="space-y-2">
								<li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
								<li><Link href="/help" className="hover:text-primary">Help Center</Link></li>
								<li><Link href="/status" className="hover:text-primary">Status</Link></li>
							</ul>
						</div>
					</div>
				</div>

				{/* Divider */}
				<div className="mt-10 border-t border-gray-300 pt-6 flex flex-col md:flex-row justify-between items-center">
					<p className="text-xs">&copy; {new Date().getFullYear()} Sharavel. All rights reserved.</p>
					<div className="flex space-x-4 mt-4 md:mt-0">
						<a href="https://twitter.com" aria-label="Twitter" className="hover:text-blue-500">
							<FaTwitter size={18} />
						</a>
						<a href="https://github.com" aria-label="GitHub" className="hover:text-blue-500">
							<FaGithub size={18} />
						</a>
						<a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-blue-600">
							<FaLinkedin size={18} />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
