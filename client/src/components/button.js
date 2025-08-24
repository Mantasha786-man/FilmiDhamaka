import React from 'react'

function Button({title,onClick,variant,disabled,fullwidth,type,size='normal'}) {

    let className='bg-primary text-white'

    // Size classes
    if(size === 'small') {
        className += ' p-1 text-sm'
    } else if(size === 'large') {
        className += ' p-2 text-md'
    } else {
        className += ' p-1 text-sm' // Default normal size
    }

    if(fullwidth){
        className += ' w-full'
    }
    if(variant==='outlined'){
        className=className.replace('bg-primary','border border-primary text-primary bg-white')
    }
  return (
   <button className={className} type={type} 
   onClick={onClick} disabled={disabled}
   >
    {title}
   </button>
  )
}

export default Button;
