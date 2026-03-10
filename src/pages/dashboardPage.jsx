import { AppSidebar } from "@/components/app-sidebar"
// import { ChartAreaInteractive } from "@/components/chart-area-interactive"
// import { DataTable } from "@/components/data-table"
// import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { TooltipProvider } from "@/components/ui/tooltip"

import { Suspense, lazy } from "react"

import data from "../assets/data.json"



export default function Page() {

const skeleton = <div className="h-28 rounded-lg bg-muted/40 animate-pulse" />;

  const ChartAreaInteractive = lazy(() =>
  import("@/components/chart-area-interactive").then((m) => ({ default: m.ChartAreaInteractive }))
  )  

  const SectionCards = lazy(() =>
  import("@/components/section-cards").then((m) => ({ default: m.SectionCards }))
)  

 const DataTable = lazy(() =>
  import("@/components/data-table").then((m) => ({ default: m.DataTable }))
)  


  // const SectionCards =  lazy(() => import("@/components/section-cards"));
  // const DataTable =  lazy(() => import("@/components/data-table"));




  return (
  <TooltipProvider>
       <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } 
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <Suspense fallback={skeleton}>
                       <SectionCards />
                    </Suspense>
              <div className="px-4 lg:px-6">
                   <Suspense fallback={skeleton}>
                         <ChartAreaInteractive />
                   </Suspense>
              </div>
                  <Suspense fallback={skeleton}>
                    <DataTable data={data} />
                  </Suspense>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  </TooltipProvider>
   
  )
}
