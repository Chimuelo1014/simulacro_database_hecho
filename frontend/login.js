// const formLogin = document.getElementById('formLogin');
// formLogin.addEventListener('submit', (event)=>{
//     event.preventDefault();
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     fetch('http://localhost:3000/users')
//     .then(response => response.json())
//     .then(
//         user => {
//         user.forEach(user => {
//             if(user.username == email && user.user_password == password)
//             {
//                 alert('credenciales correctas')
//             }else {
//                 alert('credenciales incorrectas')
//                 return;
//             }
            
//         });
//     })
// })


            

const formLogin = document.getElementById('formLogin');

formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/users');
        const users = await response.json();

        users.forEach(user => {
            if (
                user.username === email && 
                user.user_password === password // aquí deberías usar el campo correcto de la contraseña
            ) {
                alert('Credenciales correctas');
                window.location.href = 'dashboard.html';

            } 
        });

    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
});
