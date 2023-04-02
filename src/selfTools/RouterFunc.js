export function comparation(userRouter = [], allRouter = []) {
    let realRouter = []
    allRouter.forEach(item => {
        userRouter.forEach(subItem => {
            if (item.meta && item.meta.title === subItem.title) {
                if (item.children && item.children.length > 0) {
                    item.children = comparation(subItem.children)
                }
                realRouter.push(item)
            }
        })
    })
    return realRouter
}
/*
该函数用于比较用户权限路由和所有路由的差异，返回实际可访问的路由列表。其中，userRouter是用户拥有的权限路由列表，allRouter是所有路由列表。该函数通过遍历allRouter和userRouter中的路由项，
比较其meta.title属性，将匹配的路由项加入realRouter数组中，如果该路由项具有子路由，则递归调用comparation函数，将子路由加入该路由项的children属性中。最后返回实际可访问的路由列表realRouter。

*/ 