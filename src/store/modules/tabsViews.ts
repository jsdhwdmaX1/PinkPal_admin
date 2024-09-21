import { defineStore } from "pinia";

export const useTabsViewsStore = defineStore({
    id: "tabsViewsState",
    state: () => ({
        activeTabsView: '',
        visitedTabsViews: [
            { path: '/home', name: 'Home', title: '首页' , meta: { title: '首页' , affix: true } },
        ]
    }),
    getters: {},
    actions: {
        setTabsViewValue(value: string) {
            this.activeTabsView = value
        },
        addVisitedTabsView(view: any) {
            this.setTabsViewValue(view.path)
            if(this.visitedTabsViews.some(v => v.path === view.path)) return
            this.visitedTabsViews.push(
                Object.assign({}, {
                    path: view.path,
                    name: view.name || 'no-name',
                    title: view.meta.title || 'no-title',
                    meta: view.meta || {},
                })
            )
        },
        addView( view: any){
            this.addVisitedTabsView(view)
        },
        removeVisitedTabsView(view: any) {
            this.visitedTabsViews = this.visitedTabsViews.filter(v => {
                return v.path !== view || v.meta.affix
            })
        },
        delView(view: any) {
            this.removeVisitedTabsView(view)
            console.log(view)
        },
    },
})