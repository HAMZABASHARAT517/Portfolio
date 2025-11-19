// Scroll reveal sections
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver((entries, obs)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
        }
    });
}, {threshold:0.2});
sections.forEach(sec=>observer.observe(sec));

// Rotating words
const words = document.querySelectorAll('.rotating-word');
let index = 0;
setInterval(()=>{
    words.forEach((w,i)=>w.style.opacity=(i===index?1:0));
    index=(index+1)%words.length;
},2000);
