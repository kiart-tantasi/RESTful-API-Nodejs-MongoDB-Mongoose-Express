const url = "https://catfact.ninja/fact";
// const url = "http://localhost:3000/items";

const loadData = () => {
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // obj = JSON.stringify(data);
        obj = data.fact;
        document.getElementById("textHere").innerHTML = obj;
    });

} 
loadData();

// const loadData2 = async() => {
//     const res = await fetch(url);
//     const data = await res.json();
//     console.log(data);
// }

// loadData2();
