document.addEventListener("DOMContentLoaded", function() {
    const div = document.querySelector(".gjs-pn-options .gjs-pn-buttons");

    const save_btn = document.createElement("button");
    save_btn.id = "save_btn";
    save_btn.classList = "text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-2 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900";
    save_btn.innerHTML = "Save";

    div.appendChild(save_btn);

});