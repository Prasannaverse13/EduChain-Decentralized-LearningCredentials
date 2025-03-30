export default function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">How EduChain Works</h2>
          <p className="text-neutral-600">Our platform leverages Stellar blockchain technology to create tamper-proof credentials that are globally recognized and easily verifiable.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-book-open text-primary text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Complete Courses</h3>
            <p className="text-neutral-600">Enroll in courses from our educational partners and complete the requirements.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-certificate text-secondary text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">2. Earn Credentials</h3>
            <p className="text-neutral-600">Receive blockchain-verified credentials that are recorded on the Stellar network.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-share-alt text-accent text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Share & Verify</h3>
            <p className="text-neutral-600">Share your credentials globally with a simple verification process for employers.</p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <a href="#courses" className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition">
            Learn more about our technology
            <i className="fas fa-arrow-right ml-2"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
