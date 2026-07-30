import { NavLink } from "react-router"

interface StatusProp {
    showSidebar: boolean;
    setShowSidebar: (status: boolean) => void;
}

function Sidebar({showSidebar, setShowSidebar}: StatusProp) {
    return (
        <>
            <div 
                onClick={() => setShowSidebar(!showSidebar)} 
                className={`fixed inset-0 z-10 bg-black/80 transition-opacity duration-200 ${showSidebar ? 'opacity-100' : 'opacity-0'}`}
                >
            </div>
            <aside 
                className={`sidebar fixed top-0 left-0 min-w-[18rem] h-screen z-12 flex flex-col transition-transform duration-350 ease-in-out ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex justify-around items-center px-5 py-5 gap-3 border-b border-b-black/15">
                    <img src="src/assets/logo.png" className="w-7.5 h-auto" alt="Next Level Dads Logo" />
                    <div className="flex-1">
                        <h1 className="text-sm font-semibold">Organization Name</h1>
                        <p className="text-[10px] text-black/45 tracking-wide">NLD PARTNER PORTAL</p>
                    </div>
                </div>
                <p className="px-4 pt-4 text-xs tracking-wide text-black/45">Workspace</p>
                <div className="flex flex-col mt-2 mx-2 gap-1 text-[15px]">

                    <NavLink to={"/"} className="sidebar-link">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f5d57"><path d="M336-552H216q-33 0-52.5-19.5T144-624v-120q0-33 19.5-52.5T216-816h120q33 0 52.5 19.5T408-744v120q0 33-19.5 52.5T336-552Zm-120-72h120v-120H216v120Zm120 480H216q-33 0-52.5-19.5T144-216v-120q0-33 19.5-52.5T216-408h120q33 0 52.5 19.5T408-336v120q0 33-19.5 52.5T336-144Zm-120-72h120v-120H216v120Zm528-336H624q-33 0-52.5-19.5T552-624v-120q0-33 19.5-52.5T624-816h120q33 0 52.5 19.5T816-744v120q0 33-19.5 52.5T744-552Zm-120-72h120v-120H624v120Zm120 480H624q-33 0-52.5-19.5T552-216v-120q0-33 19.5-52.5T624-408h120q33 0 52.5 19.5T816-336v120q0 33-19.5 52.5T744-144Zm-120-72h120v-120H624v120ZM336-624Zm0 288Zm288-288Zm0 288Z"/></svg>
                        Overview
                    </NavLink>

                    <NavLink to={"communities"} className="sidebar-link">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f5d57"><path d="M96-192v-92q0-25.78 12.5-47.39T143-366q54-32 114.5-49T384-432q66 0 126.5 17T625-366q22 13 34.5 34.61T672-284v92H96Zm648 0v-92q0-42-19.5-78T672-421q39 8 75.5 21.5T817-366q22 13 34.5 34.67Q864-309.65 864-284v92H744ZM282-522q-42-42-42-102t42-102q42-42 102-42t102 42q42 42 42 102t-42 102q-42 42-102 42t-102-42Zm396 0q-42 42-102 42-8 0-15-.5t-15-2.5q25-29 39.5-64.5T600-624q0-41-14.5-76.5T546-765q8-2 15-2.5t15-.5q60 0 102 42t42 102q0 60-42 102ZM168-264h432v-20q0-6.47-3.03-11.76-3.02-5.3-7.97-8.24-47-27-99-41.5T384-360q-54 0-106 14t-99 42q-4.95 2.83-7.98 7.91-3.02 5.09-3.02 12V-264Zm267-309.21q21-21.21 21-51T434.79-675q-21.21-21-51-21T333-674.79q-21 21.21-21 51T333.21-573q21.21 21 51 21T435-573.21ZM384-264Zm0-360Z"/></svg>
                        Communities
                    </NavLink>

                    <NavLink to={"events"} className="sidebar-link">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f5d57"><path d="M216-96q-29.7 0-50.85-21.5Q144-139 144-168v-528q0-29 21.15-50.5T216-768h72v-96h72v96h240v-96h72v96h72q29.7 0 50.85 21.5Q816-725 816-696v528q0 29-21.15 50.5T744-96H216Zm0-72h528v-360H216v360Zm0-432h528v-96H216v96Zm0 0v-96 96Z"/></svg>
                        Events
                    </NavLink>

                </div>
            </aside>
        </>
    )
}

export default Sidebar