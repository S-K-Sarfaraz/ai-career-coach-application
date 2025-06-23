import React from 'react'

const EmptyState = ({selectQuestion}:any) => {
    const questionList = [
        'What skill do I need for the data analyst role?',
        'How do I switch career to UI/UX desiner?'
    ]
  return (
    <div>
        <h2 className='font-bold text-xl text-center'>Ask Anything To AI Career Agent</h2>
        <div>
            {
                questionList.map((question, index)=>(
                    <h2 className='p-4 text-center border rounded-lg my-3 hover:border-primary cursor-pointer' 
                    key={index}
                    onClick={()=>selectQuestion(question)}
                    >
                        {question}
                    </h2>
                ))
            }
        </div>
    </div>
  )
}

export default EmptyState