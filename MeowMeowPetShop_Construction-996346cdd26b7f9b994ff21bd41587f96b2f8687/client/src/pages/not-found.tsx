import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-green-50 px-4">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Background Elements */}
        <div className="relative">
          {/* Clouds */}
          <div className="absolute top-10 left-10 w-16 h-10 bg-white rounded-full opacity-80"></div>
          <div className="absolute top-5 left-20 w-12 h-8 bg-white rounded-full opacity-60"></div>
          <div className="absolute top-8 right-20 w-20 h-12 bg-white rounded-full opacity-70"></div>
          <div className="absolute top-2 right-10 w-14 h-9 bg-white rounded-full opacity-50"></div>
          
          {/* Grass patches */}
          <div className="absolute bottom-20 left-5 w-12 h-6 bg-green-400 rounded-t-full"></div>
          <div className="absolute bottom-16 left-16 w-8 h-4 bg-green-500 rounded-t-full"></div>
          <div className="absolute bottom-24 right-8 w-10 h-5 bg-green-400 rounded-t-full"></div>
          <div className="absolute bottom-18 right-20 w-14 h-7 bg-green-500 rounded-t-full"></div>
          
          {/* Main Content */}
          <div className="relative z-10">
            {/* 404 Number */}
            <h1 className="text-8xl md:text-9xl font-bold text-gray-800 mb-8">404</h1>
            
            {/* Cat Character */}
            <div className="relative inline-block mb-8">
              {/* Cat Body */}
              <div className="relative">
                {/* Cat Head */}
                <div className="w-24 h-20 bg-orange-400 rounded-full mx-auto mb-2 relative">
                  {/* Ears */}
                  <div className="absolute -top-3 left-4 w-6 h-8 bg-orange-400 rounded-t-full transform -rotate-12"></div>
                  <div className="absolute -top-3 right-4 w-6 h-8 bg-orange-400 rounded-t-full transform rotate-12"></div>
                  {/* Inner ears */}
                  <div className="absolute -top-1 left-6 w-3 h-4 bg-pink-300 rounded-t-full transform -rotate-12"></div>
                  <div className="absolute -top-1 right-6 w-3 h-4 bg-pink-300 rounded-t-full transform rotate-12"></div>
                  
                  {/* Eyes */}
                  <div className="absolute top-6 left-6 w-3 h-3 bg-black rounded-full"></div>
                  <div className="absolute top-6 right-6 w-3 h-3 bg-black rounded-full"></div>
                  
                  {/* Nose */}
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pink-500 rounded-sm rotate-45"></div>
                  
                  {/* Mouth */}
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
                    <div className="w-1 h-2 bg-black"></div>
                    <div className="absolute top-2 -left-2 w-4 h-1 border-b-2 border-black rounded-full"></div>
                  </div>
                  
                  {/* Sad expression */}
                  <div className="absolute top-5 left-5 w-4 h-2 border-t-2 border-black rounded-full transform rotate-12"></div>
                  <div className="absolute top-5 right-5 w-4 h-2 border-t-2 border-black rounded-full transform -rotate-12"></div>
                </div>
                
                {/* Cat Body */}
                <div className="w-20 h-16 bg-orange-400 rounded-full mx-auto relative">
                  {/* Stripes */}
                  <div className="absolute top-2 left-2 right-2 h-1 bg-orange-600 rounded"></div>
                  <div className="absolute top-6 left-3 right-3 h-1 bg-orange-600 rounded"></div>
                  <div className="absolute top-10 left-2 right-2 h-1 bg-orange-600 rounded"></div>
                </div>
                
                {/* Cat Legs */}
                <div className="flex justify-center gap-1 mt-1">
                  <div className="w-3 h-8 bg-orange-400 rounded-b-full"></div>
                  <div className="w-3 h-8 bg-orange-400 rounded-b-full"></div>
                  <div className="w-3 h-8 bg-orange-400 rounded-b-full"></div>
                  <div className="w-3 h-8 bg-orange-400 rounded-b-full"></div>
                </div>
                
                {/* Cat Tail (curved) */}
                <div className="absolute -right-8 top-8 w-16 h-3 bg-orange-400 rounded-full transform rotate-45 origin-left"></div>
                <div className="absolute -right-6 top-4 w-12 h-3 bg-orange-400 rounded-full transform rotate-12 origin-left"></div>
              </div>
              
              {/* Leash */}
              <div className="absolute top-4 -right-20 w-24 h-1 bg-red-500 transform rotate-12"></div>
              <div className="absolute top-4 -right-16 w-4 h-4 bg-red-600 rounded-full"></div>
            </div>
            
            {/* Text Content */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Meow! Looks like you're lost
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                The page you're looking for is not available!
              </p>
              <p className="text-sm text-gray-500">
                Our cat seems to have knocked it off the internet shelf 🐾
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-1 justify-center items-center">
              <Link href="/">
                <Button className="bg-[#26732d] hover:bg-[#1e5d26] text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-1">
                  <Home size={20} />
                  Go Home
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="border-[#26732d] text-[#26732d] hover:bg-[#26732d] hover:text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-1"
              >
                <ArrowLeft size={20} />
                Go Back
              </Button>
            </div>
            
            {/* Fun fact */}
            <div className="mt-12 p-4 bg-white/70 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-gray-600">
                <strong>Fun Fact:</strong> Cats spend 70% of their lives sleeping. 
                Maybe this page is just taking a cat nap! 😴
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
