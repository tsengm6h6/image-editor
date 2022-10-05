const fileInput = document.querySelector('.file-input')
const chooseImgBtn = document.querySelector('.choose-image')
const previewImg = document.querySelector('.image-preview img')
const filterOptions = document.querySelectorAll('.filter .options .button')
const filterName = document.querySelector('.slider .slider-info .name')
const filterValue = document.querySelector('.slider .slider-info .value')
const sliderInput = document.querySelector('.slider input')
const transformOptions = document.querySelectorAll('.rotate .options .button')
const resetBtn = document.querySelector('.button.reset')

const loadImage = (evt) => {
  const file = evt.target.files[0]
  if (!file) return
  previewImg.src = URL.createObjectURL(file)
  previewImg.addEventListener('load', () => {
    document.querySelector('.container').classList.remove('disabled')
  })
}

fileInput.addEventListener('change', loadImage)
chooseImgBtn.addEventListener('click', () => fileInput.click())

const DEFALTFILTER = {
  brightness: 100,
  saturation: 100,
  inversion: 0,
  grayscale: 0
}

const DEFAULTTRANSFORM = {
  rotate: 0,
  flipX: 1,
  flipY: 1
}

let currentFilter = {
  brightness: 100,
  saturation: 100,
  inversion: 0,
  grayscale: 0
}


let currentTransform = {
  rotate: 0,
  flipX: 1,
  flipY: 1
}

const sliderMax = {
  brightness: 200,
  saturation: 200,
  inversion: 100,
  grayscale: 100
}

const applyChange = () => {
  previewImg.style.filter = `
    brightness(${currentFilter.brightness}%)
    saturate(${currentFilter.saturation}%)
    invert(${currentFilter.inversion}%)
    grayscale(${currentFilter.grayscale}%)
  `
  previewImg.style.transform = `
    rotate(${currentTransform.rotate}deg)
    scale(${currentTransform.flipX}, ${currentTransform.flipY})
  `
}

// filter
const setCurrentFilter = (option) => {
  document.querySelector('.options .active').classList.remove('active')
    option.classList.add('active')
    filterName.innerText = option.innerText
    filterValue.innerText = `${currentFilter[option.id]}%`
    sliderInput.max = sliderMax[option.id]
    sliderInput.value = currentFilter[option.id]
}

const updateFilter = (evt) => {
  filterValue.innerText = `${evt.target.value}%`
  const selectedOption = document.querySelector('.options .active')
  currentFilter[selectedOption.id] = evt.target.value
  applyChange()
}

filterOptions.forEach(option => {
  option.addEventListener('click', () => setCurrentFilter(option))
})
sliderInput.addEventListener('input', updateFilter)

// transform
const updateTransform = (option) => {
  if (option.id === 'left' || option.id === 'right') {
    option.id === 'left' ? currentTransform.rotate -= 90 : currentTransform.rotate += 90
  } else if (option.id === 'horizontal') {
    currentTransform.flipX = currentTransform.flipX === 1 ? -1 : 1
  } else {
    currentTransform.flipY = currentTransform.flipY === 1 ? -1 : 1
  }
  applyChange()
}

transformOptions.forEach((option) => {
  option.addEventListener('click', () => updateTransform(option))
})

const reset = () => {
  currentFilter = { ... DEFALTFILTER }
  currentTransform = {... DEFAULTTRANSFORM}
  applyChange()
  filterOptions[0].click()
}

resetBtn.addEventListener('click', reset)