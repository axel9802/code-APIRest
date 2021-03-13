const d = document,
$table = d.querySelector(".crud-table"),
$form = d.querySelector(".crud-form"),
$title = d.querySelector(".crud-title"),
$template = d.getElementById("crud-template").content,
$fragment = d.createDocumentFragment();

const ajax = (options) => {

    let {url, method, success, error, data} = options;
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", e => {
        if (xhr.readyState !== 4) {
            return;
        }
         //De 200 a 299 son status de peticiones exitosas
         if (xhr.status >= 200 && xhr.status < 300) {
            //console.log("Éxito");
            //console.log(xhr.responseText);
            //Para convertir el JSON a objeto JS
            let json= JSON.parse(xhr.responseText);
            //console.log(json);

            //Ejecutar la funcion que el usuario pase en el método succes.
            //Pasarle la respuesta en objeto JS
            success(json);
         } else {
             //En el statusText indican el error pero si no lo indican imprimirá un "Ocurrió un error"
            let message = xhr.statusText || "Ocurrió un error";
            //Ejectuar la función error
            error(`Error ${xhr.status}: ${message}`);
         }
    });

    xhr.open(method || "GET", url); //Si el usuario no especifica el método será GET por default
    xhr.setRequestHeader("Content-Type","application/json; charset=utf-8"); //Especificamos el tipo de texto que se va enviar. Por defecto es texto plano
    xhr.send(JSON.stringify(data));
}

const getAll = () => {
    ajax({
       //method: "GET",
        url: "http://localhost:3000/santos",
        success: (resp) => {
           // console.log(resp);
            resp.forEach(element => {
                $template.querySelector(".name").textContent = element.nombre;
                $template.querySelector(".constellation").textContent = element.constelacion;

                $template.querySelector(".edit").dataset.id = element.id;  //Para acceder a los data attributes se pone dataset. luego va el nombre del nuevo data attribute
                $template.querySelector(".edit").dataset.name = element.nombre;
                $template.querySelector(".edit").dataset.constellation = element.constelacion 
                
                $template.querySelector(".delete").dataset.id = element.id;

                //El template se debe clonar para que se quede en memoria
                let $clone = d.importNode($template, true) //true porque lo quiero con el contenido, false sería vacío
                $fragment.appendChild($clone);
            });

            $table.querySelector("tbody").appendChild($fragment);
        },
        error: (error) => {
           // console.log(error);
            $table.insertAdjacentHTML("afterend", `<p><b>${error}</b></p>`);
        },
        //data: null //No es necesario mandar ninguna petición
    })
}
d.addEventListener("DOMContentLoaded", getAll);

d.addEventListener("submit", e => {
    //Si es que el objeto que origina ese evento es el formulario entonces...
    if (e.target === $form) {
        //Prevenir el comportamiento por defecto que tiene el envío del formulario que es detener la ejecución porque será a través de ajax 
        e.preventDefault();
        //Si el elemento id está vacío
        if(!e.target.id.value){
            //POST - CREATE
            ajax({
                url: "http://localhost:3000/santos",
                method: "POST",
                success: (resp) => location.reload(),
                error: () => $form.insertAdjacentHTML("afterend", `<p><b>${error}</b></p>`),
                data: {
                //De db.json       //De name en el html  
                    nombre: e.target.nombre.value,
                    constelacion: e.target.constelacion.value
                }
            });
        }else {
            //PUT - UPDATE
            ajax({
                url: `http://localhost:3000/santos/${e.target.id.value}`,
                method: "PUT",
                success: (resp) => location.reload(),
                error: () => $form.insertAdjacentHTML("afterend", `<p><b>${error}</b></p>`),
                data: {
                //De db.json       //De name en el html  
                    nombre: e.target.nombre.value,
                    constelacion: e.target.constelacion.value
                }
            });
        }
    }
});

d.addEventListener("click", e => {
    //Cuando el objeto que origina el evento es .edit. Ahora el e.target es el boton
    if (e.target.matches(".edit")) {
        $title.textContent = "Editar Santo";
        $form.nombre.value = e.target.dataset.name;
        $form.constelacion.value = e.target.dataset.constellation;
        $form.id.value = e.target.dataset.id;
    }
    if (e.target.matches(".delete")) {
        let isDelete = confirm(`¿Estás seguro de eliminar el id ${e.target.dataset.id}?`);
        if (isDelete) {
            //DELETE - DELETE
            ajax({
                url: `http://localhost:3000/santos/${e.target.dataset.id}`,
                method: "DELETE",
                success: (resp) => location.reload(),
                error: () => alert(error)
            });
        }
    }
});