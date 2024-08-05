var st = document.querySelector(".stories-content")
var stc = document.querySelector(".stories-completed-content")
var buttonSt = document.querySelector(".button-st")
var buttonStc = document.querySelector(".button-stc")
st.style.display = "flex"
stc.style.display = "none"

function openTab(idTab) {
    if (idTab == "stories-content") {
        st.style.display = "flex"
        stc.style.display = "none"

        buttonSt.classList.add("selected");
        buttonStc.classList.remove("selected");
    }
    if (idTab == "stories-completed-content") {
        stc.style.display = "flex";
        st.style.display = "none";

        buttonStc.classList.add("selected");
        buttonSt.classList.remove("selected");
    }
}