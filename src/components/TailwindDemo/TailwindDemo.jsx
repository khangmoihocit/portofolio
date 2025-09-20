import React from 'react';

const TailwindDemo = () => {
  return (
    <div className="container-tw section-padding">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white-custom mb-4">
          Tailwind CSS Integration Demo
        </h2>
        <p className="text-light-slate text-lg">
          Examples of Tailwind utilities working alongside SCSS
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Card 1 - Basic Card */}
        <div className="card-tw hover-lift">
          <h3 className="text-xl font-semibold text-green-custom mb-3">
            Custom Card
          </h3>
          <p className="text-light-slate mb-4">
            This card uses Tailwind's custom component classes defined in our CSS.
          </p>
          <button className="btn-tailwind btn-primary-tw">
            Primary Button
          </button>
        </div>

        {/* Card 2 - Glass Effect */}
        <div className="glass-effect p-6 rounded-lg hover-scale">
          <h3 className="text-xl font-semibold text-white-custom mb-3">
            Glass Effect
          </h3>
          <p className="text-light-slate mb-4">
            Glassmorphism effect using Tailwind utilities.
          </p>
          <button className="btn-tailwind btn-secondary-tw">
            Secondary Button
          </button>
        </div>

        {/* Card 3 - Gradient Text */}
        <div className="bg-navy/60 border border-green-custom/30 p-6 rounded-lg hover:border-green-custom transition-all duration-300">
          <h3 className="text-xl font-semibold text-gradient mb-3">
            Gradient Text
          </h3>
          <p className="text-light-slate mb-4">
            Text with gradient effect using Tailwind utilities.
          </p>
          <button className="btn-tailwind btn-outline-tw">
            Outline Button
          </button>
        </div>
      </div>

      {/* Form Example */}
      <div className="max-w-md mx-auto card-tw">
        <h3 className="text-2xl font-bold text-white-custom mb-6 text-center">
          Contact Form
        </h3>
        <form className="space-y-4">
          <div>
            <label className="block text-light-slate mb-2">Name</label>
            <input 
              type="text" 
              className="input-tw" 
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-light-slate mb-2">Email</label>
            <input 
              type="email" 
              className="input-tw" 
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-light-slate mb-2">Message</label>
            <textarea 
              className="textarea-tw h-32" 
              placeholder="Your message..."
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="w-full btn-tailwind btn-primary-tw"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Utility Examples */}
      <div className="mt-12 text-center">
        <h3 className="text-2xl font-bold text-white-custom mb-6">
          Utility Examples
        </h3>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <span className="animated-underline text-green-custom cursor-pointer">
            Animated Underline
          </span>
          <span className="text-gradient font-bold text-xl">
            Gradient Text
          </span>
          <div className="spinner w-6 h-6"></div>
        </div>

        <div className="flex justify-center space-x-4">
          <div className="w-12 h-12 bg-green-custom rounded-full hover-lift cursor-pointer"></div>
          <div className="w-12 h-12 bg-light-slate rounded-full hover-scale cursor-pointer"></div>
          <div className="w-12 h-12 bg-slate rounded-full hover:rotate-45 transition-transform duration-300 cursor-pointer"></div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fab">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  );
};

export default TailwindDemo;