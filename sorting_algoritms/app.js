console.log('hello')

// <---------------------------------------------------------------------------->

function stop(){
	stop_array[0] = true;
	start_btn.innerHTML = "PLAY<i class='play'></i>";
	start_btn.className = "btn-play";
	granulation_slider.disabled = false;
	speed_slider.disabled = false;
	randomise_btn.disabled = false;
	select_object.disabled = false;
	data_type_select.disabled = false;
}

function start(){
	stop_array[0] = false;
	start_btn.innerHTML = "STOP<i class='stop'></i>";
	start_btn.className = "btn-stop";
	granulation_slider.disabled = true;
	randomise_btn.disabled = true;
	select_object.disabled = true;
	data_type_select.disabled = true;
}

function create_dataset(entrances){
	if (2 <= entrances <= 100){
		var dataset = [];
		for (i=0; i<entrances; i++){
			dataset.push(Math.floor(Math.random() * 100 + 1));
		}
		return dataset;
	}
}
var stop_array = [true];
var dataset = create_dataset(100);
console.log(dataset);

function create_background_array(dataset){
	var background_array = []
	for (i=0; i<dataset.length;i++){
		background_array.push('rgba(172, 34, 234,0.4)');
	}
	return background_array;
}

var background_array = create_background_array(dataset);

function fill_background_array(background_array, rgba_string){
	for(let i=0; i<background_array.length; i++){
		background_array[i] = rgba_string;
	}
}

// <---------------------------------------------------------------------------->

function create_chart(dataset, background_array){
	var empty_labels = [];
	for (i=0; i<dataset.length; i++){
		empty_labels.push('');
	}

	var chart = document.getElementById('myChart').getContext('2d');

	var myChart = new Chart(chart, {
	    type: 'bar',
	    data: {
	        labels: empty_labels,
	        datasets: [{
	            data: dataset,
	            backgroundColor: background_array,
	            borderWidth: 3
	        }]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	            	gridLines:{
	            		display:false,
	            		drawBorder:false
	            	},
	                ticks: {
	                    beginAtZero: true,
	                    display: false
	                }
	            }],
	            xAxes: [{
	            	gridLines:{
	            		beginAtZero: true,
	            		display:false,
	            	}

	            }]
	        },
	        animation: {
	        	duration: 0
	        },
	        legend: {
	        	display: false,
	        }
	    }
	});
	return myChart
}
// <---------------------------------------------------------------------------->

var draw_chart = create_chart(dataset, background_array);
var start_btn = document.getElementById('sort');
var granulation_slider = document.getElementById('granulation_slider');
// console.log("granulation slider value:", granulation_slider.value)

var speed_slider = document.getElementById('speed_slider');
var randomise_btn = document.getElementById('randomise');
var select_object = document.getElementById('sort_select');
var data_type_select = document.getElementById('data_type_select');

granulation_slider.addEventListener("input", function(){update_dataset(dataset, background_array, draw_chart, granulation_slider);}, false);
randomise_btn.addEventListener("click", function(){update_dataset(dataset, background_array, draw_chart, granulation_slider);}, false);
data_type_select.addEventListener("change", function(){update_dataset(dataset, background_array, draw_chart, granulation_slider);}, false);

// <---------------------------------------------------------------------------->
function update_dataset(dataset, background_array, chart, granulation_slider) {
	var select_object = document.getElementById('data_type_select');
	var data_type_id = select_object.options[select_object.selectedIndex].value;

	switch (data_type_id) {
		case '1':
			//Random data order
			for (let i = 0; i < granulation_slider.value; i++) {
				chart.data.datasets.forEach((dataset) => {
					dataset.data[i] = Math.floor(Math.random() * 100 + 1);
					dataset.backgroundColor[i] = 'rgba(172, 34, 234, 0.4)';
				});
				chart.data.labels[i] = '';
			}
			break;

		case '2':
			//Invert data order
			for (let i = 0; i < granulation_slider.value; i++) {
				chart.data.datasets.forEach((dataset) => {
					dataset.data[i] = granulation_slider.value - i;
					dataset.backgroundColor[i] = 'rgba(172, 34, 234, 0.4)';

				});
				chart.data.labels[i] = '';
			}
			break;
	}

	if (dataset.length > granulation_slider.value) {
		for (let i = parseInt(dataset.length, 10) - parseInt(granulation_slider.value, 10); i > 0; i--) {
			chart.data.datasets.forEach((dataset) => {
				dataset.data.pop();
				dataset.backgroundColor.pop();
			});
			chart.data.labels.pop();
		}
	}
	chart.update();
}

// <---------------------------------------------------------------------------->

// ALGORYTM QUICK SORT
// Quick sort is a comparison sorting algorithm that uses a divide and conquer strategy.

async function quickSort(chart, dataset, background_array, speed_slider, stop_array){
	// iterative,stack show indexes are sorted (= true)

	var stack = new Array(dataset.length).fill(false);
	stack.push(true);
	var sorted = false;

	var l_border = 0;
	var r_border = stack.length-1;

	// set up data for chosing LESSER i GREATER
	while (!sorted){
		// finds 1st unsorted index, sets it as left border for sorting
		for (let i=l_border; i<stack.length; i++){
			if (!stack[i]){
				l_border = i;
				break;
			}
			l_border = -1;
		}
		// if there is false value in stack - sort, else break
		if (l_border > -1){
			// finds 1st true value after left border, sets right border
			for (let i=l_border; i<stack.length; i++){
				if (stack[i]){
					r_border=i-1;
					break;
				}
			}
	// start of sorting
			var pivot_index = r_border; //set last index to sort as pivot
			var left = l_border;  //left 'finger' - GREATER
			var right = pivot_index-1; //right 'finger'
			while(true){
				// sets left finger (1st value that is greater than pivot) -GREATER
				for (let i=left; i<pivot_index; i++){
					left = -1;

					if (stop_array[0]){
						stop();
						return;
					}

					quickSort_colors(background_array, stack, pivot_index, left, right, i);
					chart.update();
					await sleep(-speed_slider.value);

					if (dataset[i]>dataset[pivot_index]){
						left = i;
						break;
					}
				}
				// set up pivot if left finger doesnt exists
				if (left == -1){
					stack[pivot_index] = true;
					break;
				} else {
					// sets LESSER
					for (let i=right; i>=0; i--){
						right = -1;

						if (stop_array[0]){
							stop();
							return;
						}

						quickSort_colors(background_array, stack, pivot_index, left, right, i);
						chart.update();
						await sleep(-speed_slider.value);

						if (dataset[i]<dataset[pivot_index]){
							right = i;
							break;
						}
					}
					// if left > right swap left and pivot, then pivot will be on the right place
					if (left > right){
						swap(dataset, left, pivot_index);
						stack[left] = true;
						break;
					} else{
						//swap
						swap(dataset, left, right);
					}
				}
			}
		} else{
			sorted = true;
			fill_background_array(background_array, 'rgba(12, 180, 124, 0.4)');
			chart.update();
			stop();
		}
	}
}

function quickSort_colors(background_array, sorted_array, pivot, left_finger, right_finger, current_index){
	for (let i=0; i<background_array.length; i++){
		if (sorted_array[i]){
			background_array[i] = 'rgba(12, 180, 124, 0.4)';
		} else {
			background_array[i] = 'rgba(172, 34, 234, 0.4)';
		}
	}
	background_array[current_index] = 'rgba(248, 103, 119, 0.4)';
	background_array[pivot] = '#a504f7';
	if (left_finger>-1){
		background_array[left_finger] = '#fc54ac';
	}
	if (right_finger>-1){
		background_array[right_finger] = '#0c73cc';
	}
}

// <---------------------------------------------------------------------------->

// ALGORYTM MERGE SORT
// Merge Sort is an algorithm where the main list is divided down into two half
//  * sized lists, which then have merge sort called on these two smaller lists
//  * recursively until there is only a sorted list of one
//  * On the way up the recursive calls, the lists will be merged together inserting
//  * the smaller value first, creating a larger sorted list.

async function mergeSort(chart, dataset, background_array, speed_slider, stop_array){
	let temp_array = dataset.map(num =>[num]);

	while (temp_array.length > 1){
		let isOdd = temp_array.length % 2;
		if (isOdd){
			temp_array[0] = merge_arrays(temp_array[0], temp_array[1]);
			temp_array.splice(1,1);

			mergeSort_colors(temp_array, background_array, dataset, 0);
			chart.update();

			if (stop_array[0]){
				stop();
				return;
			}
			await sleep(-speed_slider.value);
		}
		for (let i=0; i<temp_array.length; i++){
			temp_array[i] = merge_arrays(temp_array[i], temp_array[i+1]);
			temp_array.splice(i+1, 1);
			mergeSort_colors(temp_array, background_array, dataset, 0);
			chart.update();

			if (stop_array[0]){
				stop();
				return;
			}
			await sleep(-speed_slider.value);
		}
	}
	stop();
}

function merge_arrays(array1, array2){
	let left = 0;
	let right = 0;
	let temp = [];
	while (left <= array1.length-1 && right <= array2.length-1) {
		if (array1[left] <= array2[right]){
			temp.push(array1[left]);
			left++;
		} else {
			temp.push(array2[right]);
			right++;
		}
	}
	for (let i=left; i<array1.length; i++){
		temp.push(array1[i]);
	}
	for (let i=right; i<array2.length; i++){
		temp.push(array2[i]);
	}
	return temp;
}

function mergeSort_colors(temp_array, background_array, dataset, rightIndex){
	let colors_array = [
		'rgba(12, 180, 124, 0.4)',
		'#d4bcdc',
		'#a46482',
		'#903c5c',
		'rgba(255, 90, 255, 0.4)',
		'rgba(180, 90, 255, 0.4)',
		'#5d364d',
		'#2faadf',
		'#62b1dc',
	];
	let current_index = 0;
	for (let i=0; i<temp_array.length; i++){
		for (let j=0; j<temp_array[i].length; j++){
			background_array[current_index] = colors_array[i%9];
			dataset[current_index] = temp_array[i][j];
			current_index++;
		}
	}
}

// <---------------------------------------------------------------------------->
// ALGORYTM SELECTION SORT
//  The selection sort algorithm sorts an array by repeatedly finding the minimum element
//  *(considering ascending order) from unsorted part and putting it at the beginning. The
//  *algorithm maintains two subarrays in a given array.
//  *1) The subarray which is already sorted.
//  *2) Remaining subarray which is unsorted.
//  *
//  *In every iteration of selection sort, the minimum element (considering ascending order)
//  *from the unsorted subarray is picked and moved to the sorted subarray.

async function selectSort(chart, data, background_array, sleep_time, stop_array){
	var swap_index;
	var swap_value;

	for (j=0; j<data.length-1; j++){
		var min = data[j];
		swap_index = j;
		for (i=j; i<data.length; i++){
			if (data[i]<min){
				min = data[i];
				swap_index = i;
			}
			if (stop_array[0]){
				stop();
				return;
			}
			console.log('Taking a break that last [ms]', sleep_time.value);
			await sleep(-sleep_time.value);
			selectSort_colors(background_array, i, j, swap_index);
			chart.update();
		}
		swap_value = data[j];
		data[j] = min;
		data[swap_index] = swap_value;

	}
	fill_background_array(background_array, 'rgba(12, 180, 124, 0.4)');
	chart.update();
	stop();
}

function selectSort_colors(background_array, current_index, sorted_index, min_index){
	fill_background_array(background_array, 'rgba(172, 34, 234, 0.4)');
	for (let i=0; i<sorted_index; i++){
		background_array[i] = 'rgba(12, 180, 124,0.4)';
	}
	background_array[current_index] = 'rgb(248, 103, 119)';
	background_array[min_index] = 'rgba(12, 180, 124,0.4)';
}

// <---------------------------------------------------------------------------->
// ALGORYTM INSERTON SORT
/* In insertion sort, we divide the initial unsorted array into two parts;
* sorted part and unsorted part. Initially the sorted part just has one
* element (Array of only 1 element is a sorted array). We then pick up
* element one by one from unsorted part; insert into the sorted part at
* the correct position and expand sorted part one element at a time.
*/

async function insertionSort(chart, dataset, background_array, sleep_time, stop_aray){

	for(let i=1; i<dataset.length; i++){
		let x = dataset[i];
		let j = i-1;
		while(j>=0 && dataset[j]>x){
			dataset[j+1] = dataset[j];
			insertionSort_colors(background_array, j, i);
			chart.update();

			if (stop_array[0]){
				stop();
				return
			}

			await sleep(-sleep_time.value);
			j -= 1;
		}
		dataset[j+1] = x;
	}
	fill_background_array(background_array,'rgba(12, 180, 124,0.4)');
	chart.update();
	stop();
}

function insertionSort_colors(background_array, current_index, selected_index){
	for (let i=0; i<background_array.length;i++){
		if (i <= selected_index){
			background_array[i] = 'rgba(12, 180, 124,0.4)';
		} else {
			background_array[i] = 'rgba(172, 34, 234, 0.4)';
		}
	}
	background_array[current_index] = 'rgba(248, 103, 119, 0.4)';
}
// <---------------------------------------------------------------------------->
// ALGORYTM Bubble SORT
// Bubble Sort is a algorithm to sort an array.
// It compares adjacent element and swaps thier position The big O on bubble sort in worst
// and best case is O(N^2). Not efficient.*


async function bubbleSort(chart, dataset, background_array, sleep_time){
	var end = dataset.length - 1;
	var start = 0;
	var swapped = true;
	while (swapped){

		swapped = false;

		for (let i=start; i<end; i++){
			if(dataset[i] > dataset[i+1]){
				let x = dataset[i+1];
				dataset[i+1] = dataset[i];
				dataset[i] = x;
				swapped = true;
			}
			if (stop_array[0]){
				stop();
				return
			}
			bubbleSort_colors(background_array, i+1, start, end);
			chart.update();
			await sleep(-sleep_time.value);
		}
		end -= 1;
		if (swapped==false){
			break;
		}
	}
	fill_background_array(background_array,'rgba(12, 180, 124,0.4)');
	chart.update();
	stop();
}

function bubbleSort_colors(background_array, highlited_index, start, end){

	fill_background_array(background_array,'rgba(172, 34, 234, 0.4)');

	for (let i=end+1; i<background_array.length; i++){
		background_array[i] = 'rgba(12, 180, 124,0.4)';
	}
	background_array[highlited_index] = 'rgba(248, 103, 119, 0.4)';
}

// <---------------------------------------------------------------------------->
// ALGORYTM COCTAIL SORT
// BUBBLE IN TWO DIRECTIONS
// Cocktail shaker sort is a sort algorithm that is a bidirectional bubble sort
// more information: https://en.wikipedia.org/wiki/Cocktail_shaker_sort
// more information: https://en.wikipedia.org/wiki/Bubble_sort

async function cocktailShakerSort(chart, dataset, background_array, sleep_time){
	var end = dataset.length - 1;
	var start = 0;
	var swapped = true;
	while (swapped){

		swapped = false;

		for (let i=start; i<end; i++){
			if(dataset[i] > dataset[i+1]){
				let x = dataset[i+1];
				dataset[i+1] = dataset[i];
				dataset[i] = x;
				swapped = true;
			}
			if (stop_array[0]){
				stop();
				return
			}
			cocktailShakerSort_colors(background_array, i+1, start, end);
			chart.update();
			await sleep(-sleep_time.value);
		}
		end -= 1;
		if (swapped==false){
			break;
		}
		swapped = false;
		//right to left
		for (let i=end; i>start; i--){
			if(dataset[i]<dataset[i-1]){
				let x = dataset[i-1];
				dataset[i-1]= dataset[i];
				dataset[i] = x;
				swapped = true;
			}
			if (stop_array[0]){
				stop();
				return
			}
			cocktailShakerSort_colors(background_array, i-1, start, end);
			chart.update();
			await sleep(-sleep_time.value);
		}
		start +=1;
	}
	fill_background_array(background_array,'rgba(12, 180, 124,0.4)');
	chart.update();
	stop();
}

function cocktailShakerSort_colors(background_array, highlited_index, start, end){

	fill_background_array(background_array,'rgba(172, 34, 234, 0.4)');
	for (let i=0; i<start; i++){
		background_array[i] = 'rgba(12, 180, 124,0.4)';
	}
	for (let i=end+1; i<background_array.length; i++){
		background_array[i] = 'rgba(12, 180, 124,0.4)';
	}
	background_array[highlited_index] = 'rgba(248, 103, 119, 0.4)';
}

function swap(dataset, x, y){
	var temp = dataset[x];
	dataset[x] = dataset[y];
	dataset[y] = temp;
}

function sleep(sleep_time) {
  return new Promise(resolve => setTimeout(resolve, sleep_time));
}

function select_sorting(){
	stop_array[0]=false;
	var select_object = document.getElementById('sort_select');
	var sorting_id = select_object.options[select_object.selectedIndex].value;
	start();

	switch (sorting_id){
		case '1':
		quickSort(draw_chart, dataset, background_array, speed_slider, stop_array);
		break;

        case '2':
		mergeSort(draw_chart, dataset, background_array, speed_slider, stop_array);
		break;

		case '3':
		selectSort(draw_chart, dataset, background_array, speed_slider, stop_array);
		break;

		case '4':
		insertionSort(draw_chart, dataset, background_array, speed_slider, stop_array);
		break;

		case '5':
		bubbleSort(draw_chart, dataset, background_array, speed_slider, stop_array);
		break;

		case '6':
		cocktailShakerSort(draw_chart, dataset, background_array, speed_slider, stop_array);
		break;
	}
}

start_btn.addEventListener("click", function(){
	if (stop_array[0]){
		select_sorting();
	} else {
		stop();
	}
},false);

change_legend(select_object);

function change_legend(select_object){
	var sorting_id = select_object.options[select_object.selectedIndex].value;
	var more_legend_description = document.getElementById('more_legend_description');
	switch (sorting_id){
		case '1':
		more_legend_description.innerHTML = "<span><svg width='20' height='20'><rect width='20' height='20' style='fill:#a504f7;stroke-width:3;stroke:darkgray' /></svg> - pivot </span><br>";
		more_legend_description.innerHTML += "<span><svg width='20' height='20'><rect width='20' height='20' style='fill:#fc54ac;stroke-width:3;stroke:darkgray' /></svg> - GREATER - first value greater than pivot </span><br>";
		more_legend_description.innerHTML += "<span><svg width='20' height='20'><rect width='20' height='20' style='fill:#0c73cc;stroke-width:3;stroke:darkgray' /></svg> - LESSER - last value value lesser than pivot </span><br>";
		break;

		default:
		more_legend_description.innerHTML = "";
		break;
	}
}

select_object.addEventListener("change", function(){change_legend(select_object);})



