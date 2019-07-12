const hbs = require('hbs');

hbs.registerHelper("mostrarCursos",(listado)=>{
    let texto = `<div class="row justify-content-center">
    <div class="col-sm-8">
    <table class='table table-striped table-success'> 
    <thead class='thead-dark text-center'>
    <th>Nombre</th>
    <th>Descripción</th>
    <th>Valor</th>
    <th>Información completa</th>
    </thead>
    <tbody>`;
    listado.forEach(curso =>{
        texto = texto + 
        `<tr class='text-center'>
        <td> ${curso.nombre} </td>
        <td> ${curso.descripcion} </td>
        <td> ${curso.valor}</td>
        <td><button class='btn btn-dark' id=${Number(curso.id)+100} onclick=funcion(${curso.id}) >Ver Información Completa</button></td></tr>
        </tr>`;
    })
    texto = texto + `</tbody> </table> </div></div><div class="row">`;	
    listado.forEach(element => {
        texto= texto +
                "<div id="+String(element.id)+ " style=display:none>\
                <div class='col-sm-12'>\
                <table class='table table-striped table-success'> \
                <thead class='thead-dark text-center'> \
                <th>Nombre</th>\
                <th>id</th>\
                <th>Descripcion</th>\
                <th>Valor</th>\
                <th>Modalidad </th> \
                <th>Intensidad Horaria</th>\
                <th>Estado</th>\
                <thead>\
                <tbody>"+
                "<tr class='text-center'>"+
                "<td>" +element.nombre+"</td>"+
                "<td>" +element.id+"</td>"+
                "<td>"+element.descripcion+"</td>"+
                "<td>"+element.valor+"</td>"+
                "<td>" +element.modalidad+"</td>"+
                "<td>" +element.intensidad+"</td>"+
                "<td>"+element.estado+"</td>"+
                "</tr></tbody></table></div></div>"
    });
    texto=texto+"</div>";
    return texto;
});

hbs.registerHelper("desplegarCursos",(listado)=>{
    let texto="";
    listado.forEach(curso=>{
        texto = texto +`<option value=${curso.id}>${curso.nombre}</option>`
    });
    return texto;
});

hbs.registerHelper("MostrarCursosEstudiantes",(estudiantes,cursos)=>{
    let texto=`<div class='accordion' id='padre'><div class='row'>`;
    cursos.forEach(curso=>{
        texto=texto+`
        <div class='col-sm-6'>
            <div class='card ' >
                <div class='card-header  text-center' id='${String(curso.nombre).split(/\.|\s*/).join("")+"1"}'>
                        <button class='btn btn-link' type='button' data-toggle='collapse' data-target='#${String(curso.nombre).split(/\.|\s*/).join("")}' aria-expanded='false' aria-controls='${String(curso.nombre).split(/\.|\s*/).join("")}'>${String(curso.nombre)}</button>
                </div>
                <div id='${String(curso.nombre).split(/\.|\s*/).join("")}' class='collapse' aria-labelledby='${String(curso.nombre).split(/\.|\s*/).join("")+"1"}' data-parent='#padre'>
                    <div class='card-body bg-light' style='overflow-x:auto;'>
                        <table class='table table-striped table-success' > 
                            <thead class='thead-dark text-center'>
                                <th>Nombre</th>
                                <th>Documento</th>
                                <th>Correo</th>
                                <th>Telefono</th>
                            </thead>
                        <tbody>`;
        estudiantes.forEach(estud=>{
            if(estud.cursos.includes(curso.id)){
                texto = texto + 
                            `<tr class='text-center'>
                                <td> ${estud.nombre} </td>
                                <td> ${estud.documento} </td>
                                <td> ${estud.correo}</td>
                                <td> ${estud.telefono}</td>
                            </tr>`
            }
        }
        );
        texto=texto+"</tbody></table></div></div></div><br><br></div>";      
    });
    texto=texto+"</div></div>";
    return texto;
});

hbs.registerHelper("MostrarCursosEstudiantesE",(estudiantes,cursos)=>{
    let texto=`<div class='accordion' id='padre'><div class='row justify-content-center'>`;
    cursos.forEach(curso=>{
        texto=texto+`
        <div class='col-sm-7'>
            <div class='card ' >
                <div class='card-header  text-center' id='${String(curso.nombre).split(/\.|\s*/).join("")+"1"}'>
                        <button class='btn btn-link' type='button' data-toggle='collapse' data-target='#${String(curso.nombre).split(/\.|\s*/).join("")}' aria-expanded='false' aria-controls='${String(curso.nombre).split(/\.|\s*/).join("")}'>${String(curso.nombre)}</button>
                </div>
                <div  id='${String(curso.nombre).split(/\.|\s*/).join("")}' class='collapse' aria-labelledby='${String(curso.nombre).split(/\.|\s*/).join("")+"1"}' data-parent='#padre'>
                    <div class='card-body bg-light' style='overflow-x:auto;'>
                        <table class='table table-striped table-success'> 
                            <thead class='thead-dark text-center'>
                                <th>Nombre</th>
                                <th>Documento</th>
                                <th>Correo</th>
                                <th>Telefono</th>
                                <th>Opción</th>
                            </thead>
                        <tbody>`;
        estudiantes.forEach(estud=>{
            if(estud.cursos.includes(curso.id)){
                texto = texto + 
                            `<tr class='text-center'>
                                <td> ${estud.nombre} </td>
                                <td> ${estud.documento} </td>
                                <td> ${estud.correo}</td>
                                <td> ${estud.telefono}</td>
                                <td>
                                <form action="/eliminar" method="post">
                                    <input type="hidden" name="documento" value="${estud.documento}">
                                    <input type="hidden" name="curso" value="${curso.id}">
                                    <button type="submmit" class="btn btn-danger">Eliminar</button>
                                </form>
                                </td>
                            </tr>`
            }
        }
        );
        texto=texto+"</tbody></table></div></div></div><br><br></div>";      
    });
    texto=texto+"</div></div>";
    return texto;
});
