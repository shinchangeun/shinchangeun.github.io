'use strict';
//엄격한 문법 모드를 사용하겠다(개발할때 나은 환경)
//변수를 제대로 선언하지 않으면 에러를 발생시킨다

//*스크롤에 따른 메뉴바 색상처리
const navbar = document.querySelector('#navbar');
const navbarHeight = navbar.getBoundingClientRect().height;
//사각형의 높이를 가져와라
console.log(navbarHeight); //104.5


//스크롤 이벤트 사용(스크롤시 이벤트 발생)
document.addEventListener('scroll',() => {
    // console.log('이벤트가 발생했다!');
    // console.log(window.scrollY); //스크롤 위치 알기(윈도우의 y값)

    //이벤트 발생하면  navbar 색 바뀜
    // navbar.classList.add('navbar--bold');
    //색이 바뀐채로 고정시키려고 
    //+css
    if(window.scrollY > navbarHeight){
        navbar.classList.add('navbar--bold');
    }else{
        navbar.classList.remove('navbar--bold');
    } 
    //html에 navbar--bold란 클래스가 없는데 
    //classList :navbar클래스에 속성을 추가하겠다
    //스크롤시 navbar--bold 생김
    //<nav id="navbar" class="navbar--bold">
    //클래스 여러개 쓸 수 있다 navbar__menu__item active 총 2개임
});



//스크롤에 따른 메뉴바 고정
//메뉴 클릭시 해당 페이지로 이동
const navbarMenu = document.querySelector('.navbar__menu');
navbarMenu.addEventListener('click' ,(e) => {
    //이벤트가 발생되면 매개변수 주지 않아도 특정값이 다 들어옴
    //console.log(e);
    const target = e.target;
    const link = target.dataset.link;
    //방어코드
    if (link == null){
        return;
    }
    // console.log(link);
    navbarMenu.classList.remove('open'); //토글할때 추가했음
    scrollIntoView(link);
})
//토글, 모바일 메뉴 버튼 설정 //+css
const navbarToggleBtn = document.querySelector('.navbar__toggle-btn');
navbarToggleBtn.addEventListener('click' ,(e) => {
    navbarMenu.classList.toggle('open');
});





// function scrollIntoView(selector){
//     const scrollIo = document.querySelector(selector);
//     scrollIo.scrollIntoView({behavior: 'smooth'});
// }
// //element.scrollIntoView(); :element 위치로 화면 스크롤됨
// //behavior: 'smooth' - 부드럽게 스크롤링 됨



//문제. 연락주세요 버튼 누르면 번호 있는 페이지로 스크롤 되게끔
const homeContactBtn = document.querySelector('.home__contact');
homeContactBtn.addEventListener('click', () => {
    scrollIntoView('#contact');
})




const home =  document.querySelector('.home__container');
const homeheight = home.getBoundingClientRect().height;

//contact 버튼
//문제. 위로 가는 버튼 //+css
const arrowUp = document.querySelector('.arrow-up');
document.addEventListener('scroll' , () => {
    if(window.scrollY > homeheight / 2){
        arrowUp.classList.add('visible');
    }else{
        arrowUp.classList.remove('visible'); 
    }
    //스크롤시 home__title 투명도
    home.style.opacity = 1 - window.scrollY / homeheight;
});

arrowUp.addEventListener('click', () => {
    scrollIntoView('#home');
})




function scrollIntoView(selector){
    const scrollIo = document.querySelector(selector);
    scrollIo.scrollIntoView({behavior: 'smooth'});
    selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

//element.scrollIntoView(); :element 위치로 화면 스크롤됨
//behavior: 'smooth' - 부드럽게 스크롤링 됨




//프로젝트 버튼 누르면 선택한 프로젝트 보이기
const workBtnContainer = document.querySelector('.work__categories');
const projectContainer = document.querySelector('.work__projects');
const projects = document.querySelectorAll('.project');

workBtnContainer.addEventListener('click', (e) => {
    const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
    if(filter == null){
        return;
    }

    const active = document.querySelector('.category__btn.selected');
    if(active != null){
        active.classList.remove('selected');
    }
    e.target.classList.add('selected');


    //애니메이션 줄려고,+css
    projectContainer.classList.add('anim-out');
    setTimeout(() => {
        projects.forEach((project) => {
            console.log(project.dataset.type);
            if(filter === '*' || filter === project.dataset.type){
                project.classList.remove('invisible');
            }else{
                project.classList.add('invisible');
            }
        });
        projectContainer.classList.remove('anim-out');
    }, 300);
});




//네비바 메뉴 호버시 
//모든 요소 체크할 번호,배열로
const sectionIds = [
    '#home',
    '#about',
    '#skills',
    '#work',
    '#testimonials',
    '#contact'
];

const sections = sectionIds.map((id) => document.querySelector(id));
//#home인 객체를 찾아 집어넣고를 반복
// console.log(sections);
//메뉴 위에 다섯개 가져윰
const navItems = sectionIds.map((id) => document.querySelector(`[data-link="${id}"]`));
// console.log(navItems);

let selectedNavIndex = 0; 
let selectedNavItem = navItems[0];

function selectNavItem(selected){
    selectedNavItem.classList.remove('active');
    selectedNavItem = selected;
    selectedNavItem.classList.add('active');
}





//아이템 실행시켜주는
//마우스 휠

const observerOptions = {
    root : null,
    rootMargin : '0px',
    threshold : 0.3
}

const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
        if(!entry.isIntersecting && entry.intersectionRatio > 0){
            console.log('y');
            const index = sectionIds.indexOf(`#${entry.target.id}`);
            // console.log(index);
            if(entry.boundingClientRect.y < 0){
                selectedNavIndex = index + 1;
            }else{
                selectedNavIndex = index - 1;
            }
            console.log(selectedNavIndex);
        }
    })
}


const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach((section) => observer.observe(section));



window.addEventListener('wheel' , () => {
    if(window.scrollY === 0){
        selectedNavIndex = 0;
    }else if(
        window.scrollY + window.innerHeight === document.body.clientHeight
    ) {
        selectedNavIndex = navItems.length -1;
    }
    selectNavItem(navItems[selectedNavIndex]);

});






























