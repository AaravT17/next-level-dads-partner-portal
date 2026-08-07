interface StatusProp {
    showSidebar: boolean;
    setShowSidebar: (status: boolean) => void;
}

function Toolbar({showSidebar, setShowSidebar}: StatusProp) {

    return (
        <div className="toolbar min-h-13 flex justify-between items-center px-5 border-b border-b-black/15 md:justify-start md:gap-4">
            {/* Replace with desired icon if necessary */}
            <button onClick={() => setShowSidebar(!showSidebar)}>
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M500-640v320l160-160-160-160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm120-80v-560H200v560h120Zm80 0h360v-560H400v560Zm-80 0H200h120Z"/></svg>
            </button>

            <div className="flex gap-4 items-center">
                <p className="border border-black/15 py-0.5 px-2.5 rounded-xl tracking-wider"
                    style={{fontSize: '10px'}}
                >
                    COMMUNITY GROUP
                </p>

                {/* Replace with desired icon if necessary */}
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/></svg>

                {/* TODO: Replace with avatar photo */}
                <div
                style={{width: '32px', height: '32px', backgroundColor: 'hsl(30 30% 25%)', borderRadius: '50%'}}
                >

                </div>
            </div>
        </div>
    )

}

export default Toolbar