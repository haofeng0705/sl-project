export function comparation(userRouter = [], allRouter = []) {
    let realRouter = []
    allRouter.forEach(item => {
        userRouter.forEach(subItem => {
            if (item.meta.title === subItem.title) {
                if (item.children && item.children.length > 0) {
                    item.children = comparation(subItem.children)
                }
                realRouter.push(item)
            }
        })
    })
    return realRouter
}