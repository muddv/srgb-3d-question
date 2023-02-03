import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	MeshBasicMaterial,
	Points,
	Vector3,
	BufferAttribute,
	BufferGeometry
} from 'three'
import { useMode, modeLch } from 'culori'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'

let scene, camera, renderer, controls

function init() {
	scene = new Scene()
	camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
	renderer = new WebGLRenderer({ canvas: document.querySelector('#canvas') })

	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(window.innerWidth, window.innerHeight)
	camera.position.setZ(590)
	camera.position.setY(90)
	camera.position.setX(90)
}

function generateGamut() {
	let modelData = getModelData()
	const geometry = new BufferGeometry().setFromPoints(modelData.coordinates)
	const color = new Float32Array(modelData.colors)
	geometry.setAttribute('color', new BufferAttribute(color, 3))
	const material = new MeshBasicMaterial({ vertexColors: true, wireframe: true })
	const mesh = new Points(geometry, material)
	scene.add(mesh)
	controls = new TrackballControls(camera, renderer.domElement)
}

function getModelData() {
	let lch = useMode(modeLch)
	let coordinates = []
	let colors = []
	for (let x = 0; x <= 1; x += 0.01) {
		for (let y = 0; y <= 1; y += 0.01) {
			for (let z = 0; z <= 1; z += 0.01) {
				let rgb = { mode: 'rgb', r: x, g: y, b: z }
				let color = lch(rgb)
				if (color.l && color.c && color.h) {
					coordinates.push(new Vector3(color.l, color.c, color.h))
					colors.push(rgb.r, rgb.g, rgb.b)
				}
			}
		}
	}
	return { coordinates, colors }
}

function animate() {
	requestAnimationFrame(animate)
	controls.update()
	renderer.render(scene, camera)
}

function drawFigure() {
	init()
	generateGamut()
	animate()
}

drawFigure()
