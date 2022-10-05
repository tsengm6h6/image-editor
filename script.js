const fileInput = document.querySelector('.file-input')
const previewImg = document.querySelector('.image-preview img')
const previewImgZone = document.querySelector('.image-preview')
const filterOptions = document.querySelectorAll('.filter .options .button')
const filterName = document.querySelector('.slider .slider-info .name')
const filterValue = document.querySelector('.slider .slider-info .value')
const sliderInput = document.querySelector('.slider input')
const transformOptions = document.querySelectorAll('.rotate .options .button')
const resetBtn = document.querySelector('.button.reset')
const chooseImgBtn = document.querySelector('.choose-image')
const saveBtn = document.querySelector('.button.save')

const loadImage = (file) => {
  if (!file) return
  previewImg.src = URL.createObjectURL(file)
  previewImg.addEventListener('load', () => {
    document.querySelector('.container').classList.remove('disabled')
    previewImgZone.classList.remove('drag-active')
    resetBtn.click()
  })
}

fileInput.addEventListener('change', (evt) => loadImage(evt.target.files[0]))
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

const getFilter = () => {
  return `
    brightness(${currentFilter.brightness}%)
    saturate(${currentFilter.saturation}%)
    invert(${currentFilter.inversion}%)
    grayscale(${currentFilter.grayscale}%)
  `
}

const applyChange = () => {
  previewImg.style.filter = getFilter()
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

const save = () => {
  saveBtn.innerText = 'SAVING IMAGE...'
  saveBtn.classList.add('disabled')
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = previewImg.naturalWidth
  canvas.height = previewImg.naturalHeight
  ctx.filter = getFilter()
  const { rotate, flipX, flipY } = currentTransform
  ctx.translate(canvas.width / 2, canvas.height /2)
  if (rotate !== 0) {
    ctx.rotate(rotate * Math.PI / 180)
  }
  ctx.scale(flipX, flipY)
  ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
  
  const link = document.createElement('a')
  link.download = 'image.jpg'
  link.href = canvas.toDataURL()
  link.click()
  setTimeout(() => {
    saveBtn.innerText = 'SAVE IMAGE'
    saveBtn.classList.remove('disabled')
  }, 3000);
}

saveBtn.addEventListener('click', save)

const toggleActive = () => {
  previewImgZone.classList.toggle('drag-active')
}

previewImgZone.addEventListener('dragenter', (evt) => {
  toggleActive()
})

previewImgZone.addEventListener('dragleave', (evt) => {
  toggleActive()
})

previewImgZone.addEventListener("dragover", (evt) => {
  evt.preventDefault();
});

previewImgZone.addEventListener('drop', (evt) => {
  evt.preventDefault()
  loadImage(evt.dataTransfer.files[0])
})