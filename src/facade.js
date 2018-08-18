import {Node} from './graphit.js';
import {newId} from './ids.js';

export const nodo_element = (id/*, idx = 0*/) => {
	const node = new Node(id);

	const container = document.createElement('div');
	const nodo_element = document.createElement('div');
	container.append(nodo_element);

	container.classList.add('Contêiner');

	if(node.nContent) nodo_element.classList.add('Expansível');
	nodo_element.setAttribute('data-nodo', id);
	nodo_element.contentEditable = 'true';
	//nodo_element.setAttribute('data-idx', idx);
	nodo_element.innerText = node.data || '';

	return container;
};

const replace_nodo_element = (el) => {
	new_element = nodo_element(element.getAttribute('data-nodo')/*,
							   element.getAttribute('data-idx')*/);
	document.replaceChild(new_element, el);

	if(element.classList.contains('Expandido')) {
		const childs = Array.from(el.childNodes);
		for(let i = 1; i < childs.length; i++) 
			replace_nodo_element(childs[i]);
	}
};

export const expand = el => {
	const node = new Node(el.getAttribute('data-nodo'));
	const container = el.parentElement;
	for (let i = 0; i < node.nContent; i++) {
		container.appendChild(nodo_element(node.content(i).id));
	}
	el.classList.remove('Expansível');
	el.classList.add('Expandido');
};

export const retract = el => {
	const container = el.parentElement;
	container.parentElement.replaceChild(nodo_element(el.getAttribute('data-nodo')), container);
};

export const apply = el => {
	let node = new Node(el.getAttribute('data-nodo'));
	node.data = el.innerHTML;
	
	const elementos = document.querySelectorAll(`[data-nodo="${node.id}"]`);
	for (let elemento of elementos) {
		elemento.innerHTML = node.data;
	}
};

export const insert = (parent_el, child_el = undefined, idx = undefined) => {
	let parent_id = parent_el.getAttribute('data-nodo');
	let child, parent = new Node(parent_id);
	
	//Inserção real
	if(!child_el) { //novo elemento
		child = new Node(newId());
	} else { //elemento existente
		child = new Node(child_el.getAttribute('data-nodo'));
	}
	parent.insert(child, idx);
	
	//Inserção visual
	const els = Array.from(document.querySelectorAll(`[data-nodo=${parent_id}`));
	for (let el of els) {
		if(el.classList.contains('Expandido')) {
			el.insertBefore(nodo_element(child.id, idx), el.childNodes[idx+1]);
		} else {
			el.classList.add('Expansível');
		}
	}
};