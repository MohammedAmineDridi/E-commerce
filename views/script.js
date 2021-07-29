

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeigth , 0.1 , 3000 );


camera.position.z = 100 ;

let rendu = new THREE.WebGLRenderer() ;

rendu.setClearColor(0x132644) ;

document.body.appendChild(rendu.domElement) ;

rendu.render(scene,camera) ;


