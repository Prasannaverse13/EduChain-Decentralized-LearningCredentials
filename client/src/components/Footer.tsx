import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-neutral-300 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center">
          <Link href="/">
            <a className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-graduation-cap text-white text-sm"></i>
              </div>
              <span className="text-xl font-semibold text-white">EduChain</span>
            </a>
          </Link>
        </div>
      </div>
    </footer>
  );
}
