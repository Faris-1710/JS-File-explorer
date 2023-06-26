const output = document.getElementById('output')
const file_output = document.getElementById('file_output')
const textinput = document.getElementById('textinput')
const read_btn = document.getElementById('readbtn')
const open_cmd_btn = document.getElementById('open_cmd')
const parentdir_btn = document.getElementById('parentdirbtn')
const close_file_btn = document.getElementById('close_file')
const create_folder_btn = document.getElementById('create_folder')
const create_file_btn = document.getElementById('create_file')
const create_cancel_btn = document.getElementById('create_cancel')
const create_input = document.getElementById('create_input')
const file_edit_input = document.getElementById('file_edit_input')
const file_edit_save_btn = document.getElementById('file_edit_save')
const file_edit_cancel_btn = document.getElementById('file_edit_cancel')

const main_div = document.getElementById('main')
const file_data_div = document.getElementById('file_data')
const create_div = document.getElementById('create')
const file_edit_div = document.getElementById('file_edit')

let current_directory = defined_functions.desktopPath()
let current_file = ""
let current_dir_file = false
let file_edit_display_on = false

function open_folder(folder_path) {
	close_file_btn.setAttribute('hidden', 'hidden')
	file_data_div.setAttribute('hidden', 'hidden')
	main_div.removeAttribute('hidden')

	current_dir_file = false
	current_file = ""

	fs.readdir(folder_path, (error, value) => {
		let finalArray = []

		finalArray.push('<h3>Folders</h3>')

		for (let i = 0; i < value.length; i++) {
			if (defined_functions.isPathDirectory(path.join(current_directory, value[i]))) {
				finalArray.push(`<button id='${path.join(current_directory, value[i])}' class='directory_btn' onclick='open_dir(this)'>` + value[i] + "</button>")
			}
		}

		finalArray.push('<hr>')
		finalArray.push('<h3>Files</h3>')

		for (let i = 0; i < value.length; i++) {
			if (!defined_functions.isPathDirectory(path.join(current_directory, value[i]))) {
				finalArray.push(`<button id='${path.join(current_directory, value[i])}' class='directory_btn' onclick='open_dir(this)'>` + value[i] + "</button>")
			}
		}

		output.innerHTML = finalArray.toString().replace(/,/g, '<br>')
	})
}

function open_file(file_path) {
	fs.readFile(file_path, 'utf8', (error, value) => {
		if (error) {
			console.error(error )
		} else {
			close_file_btn.removeAttribute('hidden')
			file_data_div.removeAttribute('hidden')
			main_div.setAttribute('hidden', 'hidden')

			file_output.innerHTML = value
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/\n/g, '<br>')
				.replace(/\s/g, '&nbsp;')

			current_dir_file = true
			current_file = file_path
		}
	})
}

function open_dir(button) {
	if (defined_functions.isPathDirectory(button.id)) {
		open_folder(button.id)
		current_directory = button.id
		textinput.value = button.id
	} else {
		open_file(button.id)
		textinput.value = button.id
	}
}

read_btn.onclick = () => {
	if (!fs.existsSync(textinput.value)) return

	if (defined_functions.isPathDirectory(textinput.value)) {
		current_directory = textinput.value
		open_folder(textinput.value)
	} else {
		open_file(textinput.value)
	}
}

open_cmd_btn.onclick = () => {
	child_process.exec(`start cmd.exe /K cd /D "${current_directory}"`, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error: ${error.message}`)
			return
		}

		if (stderr) {
			console.error(`Command execution failed with error: ${stderr}`)
			return
		}
	})
}

parentdir_btn.onclick = () => {
	if (current_dir_file) {
		parent_folder = path.dirname(current_file)
		textinput.value = parent_folder
		open_folder(parent_folder)
		current_directory = parent_folder
	} else {
		parent_folder = path.dirname(current_directory)
		textinput.value = parent_folder
		open_folder(parent_folder)
		current_directory = parent_folder
	}
}

close_file_btn.onclick = () => {
	close_file_btn.setAttribute('hidden', 'hidden')
	file_data_div.setAttribute('hidden', 'hidden')
	main_div.removeAttribute('hidden')

	textinput.value = path.dirname(current_file)

	current_dir_file = false
	current_file = ""
}

create_file_btn.onclick = () => {
	fs.writeFileSync(path.join(current_directory, create_input.value), "")
	open_folder(current_directory)

	create_input.value = ""
	create_div.setAttribute('hidden', 'hidden')
}

create_folder_btn.onclick = () => {
	try {
		fs.mkdirSync(path.join(current_directory, create_input.value))
	} catch (error) {
		return
	}

	open_folder(current_directory)

	create_input.value = ""
	create_div.setAttribute('hidden', 'hidden')
}

create_cancel_btn.onclick = () => {
	create_input.value = ""
	create_div.setAttribute('hidden', 'hidden')
}

file_edit_save_btn.onclick = () => {
	defined_functions.writeToFile(current_file, file_edit_input.value)

	open_folder(path.dirname(current_file))
	file_edit_div.setAttribute('hidden', 'hidden')
	file_edit_display_on = false
}

file_edit_cancel_btn.onclick = () => {
	file_edit_div.setAttribute('hidden', 'hidden')
	file_edit_display_on = false
}

document.addEventListener("keyup", (event) => {
	if (textinput === document.activeElement && event.keyCode === 13) {
		if (!fs.existsSync(textinput.value)) return

		if (defined_functions.isPathDirectory(textinput.value)) {
			current_directory = textinput.value
			open_folder(textinput.value)
		} else {
			open_file(textinput.value)
		}
	}

	else if (textinput !== document.activeElement && !current_dir_file && event.keyCode === 78) {
		file_data_div.setAttribute('hidden', 'hidden')
		create_div.removeAttribute('hidden')
	}

	else if (textinput !== document.activeElement && event.keyCode === 37) {
		textinput.value = path.dirname(current_directory)
		open_folder(path.dirname(current_directory))
		current_directory = path.dirname(current_directory)
	}

	else if (textinput !== document.activeElement && !file_edit_display_on && current_dir_file && event.keyCode === 69) {
		file_edit_div.removeAttribute('hidden')

		fs.readFile(current_file, 'utf8', (error, value) => {
			if (error) {
				console.error(error)
			}

			else {
				file_edit_input.value = value
			}
		})

		file_edit_display_on = true
	}

	else if (textinput !== document.activeElement && !current_dir_file && event.keyCode === 67) {
		child_process.exec(`start cmd.exe /K cd /D "${current_directory}"`, (error, stdout, stderr) => {
			if (error) {
				console.error(`Error: ${error.message}`)
				return
			}

			if (stderr) {
				console.error(`Command execution failed with error: ${stderr}`)
				return
			}
		})
	}
})

textinput.value = current_directory
open_folder(current_directory)
