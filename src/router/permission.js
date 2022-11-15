import router from "@/router/index";

router.beforeEach((to,from,next)=>{
    let token = window.sessionStorage.getItem("token"); //获取token
    console.log("token= "+token);
    console.log("to.path = "+to);

    const whiteList = ["/login"] //白名单
    if(token){
        //用户已经登录
        if(to.path == "/login"){ //如果是登录请求
            // 直接跳转到首页
            next("/")
        }else{
            next();//放行
        }
    }else{
         //用户未登录
         if(whiteList.includes(to.path)){ //请求在白名单里面，
            next()//直接放行
         }else{
            next("/login") //去登录
         }
    }
     
})