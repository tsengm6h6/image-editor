const fileInput = document.querySelector('.file-input')
const chooseImgBtn = document.querySelector('.choose-image')
const previewImg = document.querySelector('.image-preview img')
const filterOptions = document.querySelectorAll('.filter .options .button')
const filterName = document.querySelector('.slider .slider-info .name')
const filterValue = document.querySelector('.slider .slider-info .value')
const sliderInput = document.querySelector('.slider input')
const transformOptions = document.querySelectorAll('.rotate .options .button')
const resetBtn = document.querySelector('.button.reset')
const saveBtn = document.querySelector('.button.save')

const loadImage = (evt) => {
  const file = evt.target.files[0]
  if (!file) return
  previewImg.src = URL.createObjectURL(file)
  previewImg.addEventListener('load', () => {
    document.querySelector('.container').classList.remove('disabled')
    resetBtn.click()
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
  const ctx = canvas.getContext('2d') // 取得繪製環境
  canvas.width = previewImg.naturalWidth // set canvas width to actual image width
  canvas.height = previewImg.naturalHeight // set canvas height to actual image height
  // drawImage(image, x, y, width, height)
  ctx.filter = getFilter()
  // 處理 transform
  const { rotate, flipX, flipY } = currentTransform
  ctx.translate(canvas.width / 2, canvas.height /2) // 找到圖片中心點
  // 先 rotate 再 scale，否則旋轉角度會不正確
  if (rotate !== 0) {
    ctx.rotate(rotate * Math.PI / 180)
  }
  ctx.scale(flipX, flipY) // 縮放值若是負數，會造成座標軸鏡射 -> 笛卡爾座標系
  ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height) // 拉回左上角（=對齊中心點，鏡射才不會跑掉）
  
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