import React, { useState } from "react";
import {   } from 'lucide-react';
import {
  UserCircle,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Star, 
  ArrowUp, 
  AlertTriangle, 
  ThumbsDown, 
  Sparkle,
  Sparkles
} from "lucide-react";
import ResumeUploadDialog from "@/app/(routes)/dashboard/_components/ResumeUploadDialog";



const sectionIcons: any = {
  contact_info: <UserCircle className="w-5 h-5 text-gray-500 mr-2" />,
  experience: <Briefcase className="w-5 h-5 text-gray-500 mr-2" />,
  education: <GraduationCap className="w-5 h-5 text-gray-500 mr-2" />,
  skills: <Lightbulb className="w-5 h-5 text-gray-500 mr-2" />
};

const getBorderColor = (score: number) => {
  if (score >= 85) return "border-green-200";
  if (score >= 70) return "border-yellow-200";
  return "border-red-200";
};

const getProgressColor = (score: number) => {
  if (score >= 85) return "bg-green-500";
  if (score >= 70) return "bg-yellow-500";
  return "bg-red-500";
};

const getScoreColorclassName = (score: number) => {
  if (score >= 85) return "text-green-600";
  if (score >= 70) return "text-yellow-600";
  return "text-red-600";
};



const Report = ({aiReport}:any) => {

    const [openResumeUpload, setOpenResumeDialog] = useState(false)

  const { contact_info, education, experience, skills } = aiReport?.sections || {};

    const sectionData: { [key: string]: any } = {
        contact_info,
        education,
        experience,
        skills,
    };

    const score = aiReport?.overall_score ?? 0;

// Determine status dynamically
let statusLabel = '';
let statusColor = '';
let bgColor = '';
let StatusIcon = ArrowUp;

if (score > 80) {
  statusLabel = 'Excellent!';
  statusColor = 'text-green-700';
  bgColor = 'bg-green-100';
  StatusIcon = ArrowUp;
} else if (score >= 50) {
  statusLabel = 'Average';
  statusColor = 'text-yellow-700';
  bgColor = 'bg-yellow-100';
  StatusIcon = AlertTriangle;
} else {
  statusLabel = 'Poor';
  statusColor = 'text-red-700';
  bgColor = 'bg-red-100';
  StatusIcon = ThumbsDown;
}


  return (
    <div>
        <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-2xl mb-5">AI Analysis Results</h2>
        <button
            type="button"
            className="text-white hover:bg-gray-200 hover:text-black focus:ring-4 bg-black focus:ring-gray-300 font-medium rounded-lg text-sm px-5 flex items-center gap-2 py-2.5 gradient-button-bg shadow-lg"
            onClick={()=>setOpenResumeDialog(true)}
            >
            Re-analyze <Sparkles className="w-4 h-4 mt-[1px]" />
        </button>
    </div>



    <div className="bg-gradient-to-r from-[#be575f] via-[#8338e3] to-[#ac76d6] rounded-2xl shadow-xl p-6 mb-6 border border-white/20 transform hover:scale-[1.02] transition-transform duration-300 ease-in-out">
  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
    <Star className="text-yellow-400 mr-3 animate-pulse" size={24} />
    Overall Score
  </h3>

  <div className="flex items-center justify-between mb-6">
    <span className="text-6xl font-extrabold text-white drop-shadow-sm">
      {score}<span className="text-2xl text-white/70">/100</span>
    </span>

    <div className={`flex items-center px-3 py-1 rounded-full shadow-md ${bgColor}`}>
      <StatusIcon className={`${statusColor} text-lg mr-2`} size={20} />
      <span className={`${statusColor} text-md font-semibold`}>{statusLabel}</span>
    </div>
  </div>

  <div className="w-full bg-white/20 rounded-full h-3 mb-6 shadow-inner">
    <div
      className="bg-gradient-to-r from-blue-400 to-blue-700 h-3 rounded-full transition-all duration-500 ease-in-out"
      style={{ width: `${score}%` }}
    />
  </div>

  <p className="text-white/80 text-sm font-medium">
    {aiReport?.summary_comment}
  </p>
</div>



    {/* Section Ratings */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {['contact_info', 'education', 'experience', 'skills'].map((key) => {
      const section = sectionData[key];
      if (!section) return null;

      const score = section.score ?? 0;
      const comment = section.comment ?? "";
      const border = getBorderColor(score);
      const bar = getProgressColor(score);
      const scoreClass = getScoreColorclassName(score);

      return (
        <div
          key={key}
          className={`bg-white rounded-lg shadow-md p-5 ${border} relative overflow-hidden group`}
        >
          <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            {sectionIcons[key] || (
              <Lightbulb className="w-5 h-5 text-gray-500 mr-2" />
            )}
            {key.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </h4>

          <span className={`text-4xl font-bold ${scoreClass}`}>
            {score}%
          </span>

          <p className="text-sm text-gray-600 mt-2">{comment}</p>

          <div
            className={`absolute inset-x-0 bottom-0 h-1 ${bar} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          ></div>
        </div>
      );
    })}

</div>





    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
  <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
    <i className="fas fa-lightbulb text-orange-400 mr-2"></i> Tips for Improvement
  </h3>

  <ol className="list-none space-y-4">
    {aiReport?.tips_for_improvement.map((item: any, index: number) => (
      <li key={index} className="flex items-start">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
          <i className="fas fa-check"></i>
        </span>

        <p className="text-gray-600 text-sm">{item}</p>
      </li>
    ))}
  </ol>
</div>





    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        <div className="bg-white rounded-lg shadow-md p-5 border border-green-200">

            <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center">

                <i className="fas fa-hand-thumbs-up text-green-500 mr-2"></i> What's Good

            </h3>

            <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">

                {aiReport?.whats_good.map((item: any, index: number) => (
                    <li key={index}>{item}</li>
                ))}

            </ul>

        </div>

        <div className="bg-white rounded-lg shadow-md p-5 border border-red-200">

            <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center">

                <i className="fas fa-hand-thumbs-down text-red-500 mr-2"></i> Needs Improvement

            </h3>

            <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">

                {aiReport?.needs_improvement.map((item: any, index: number) => (
                    <li key={index}>{item}</li>
                ))}

            </ul>

        </div>

    </div>

    <div className="bg-blue-600 text-white rounded-lg shadow-md p-6 mb-6 text-center gradient-button-bg">

        <h3 className="text-2xl font-bold mb-3">Ready to refine your resume? 💪</h3>

        <p className="text-base mb-4">Make your application stand out with our premium insights and features.</p>

        <button type="button" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-blue-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">

            Upgrade to Premium <i className="fas fa-arrow-right ml-2 text-blue-600"></i>

        </button>

    </div>
    <ResumeUploadDialog openResumeUpload={openResumeUpload} setOpenResumeDialog={()=>setOpenResumeDialog(false)}/>

</div>


  )
}

export default Report