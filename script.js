const fileInput = document.querySelector('.file-input')
const chooseImgBtn = document.querySelector('.choose-image')
const previewImg = document.querySelector('.image-preview img')

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