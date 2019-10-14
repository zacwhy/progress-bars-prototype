'use strict'

main()

async function main() {
  const url = 'https://pb-api.herokuapp.com/bars'
  const data = await fetch(url).then(res => res.json())
  createProgressBars(data.limit, data.bars, data.buttons)
}

function createProgressBars(limit, barValues, buttonAmounts) {
  const root = document.getElementById('root')

  const bars = barValues.map(value => createProgress(limit, value))
  bars.forEach(bar => root.appendChild(bar.element))

  const progressSelector = document.createElement('select')
  bars.forEach((_, i) => {
    const option = document.createElement('option')
    option.innerText = 'Progress ' + (i + 1)
    progressSelector.appendChild(option)
  })
  root.appendChild(progressSelector)

  buttonAmounts.forEach(amount => {
    const button = document.createElement('button')
    button.innerText = (amount > 0 ? '+' : '') + amount
    button.onclick = () => {
      bars[progressSelector.selectedIndex].increase(amount)
    }
    root.appendChild(button)
  })
}

function createProgress(maximumValue, initialValue) {
  let currentValue = initialValue
  let intervalId = null

  const container = document.createElement('div')
  container.classList.add('progress-container')

  const bar = document.createElement('div')
  bar.classList.add('progress-bar')
  container.appendChild(bar)

  const text = document.createElement('div')
  text.classList.add('progress-text')
  container.appendChild(text)

  update()

  return {
    element: container,
    increase,
  }

  function increase(amount) {
    if (intervalId !== null) {
      // do not increase if animation is still in progress
      return
    }

    if (amount === 0) {
      return
    }

    const newValue = Math.max(currentValue + amount, 0)
    animateBarChange(newValue)
  }

  function animateBarChange(newValue) {
    const originalValue = currentValue
    intervalId = setInterval(frame, 10)

    function frame() {
      if (currentValue === newValue) {
        clearInterval(intervalId)
        intervalId = null
      } else {
        currentValue += newValue > originalValue ? 1 : -1
        update()
      }
    }
  }

  function update() {
    const percent = Math.round(currentValue / maximumValue * 100)
    text.innerText = percent + '%'
    bar.style.width = Math.min(percent, 100) + '%'
    bar.classList.toggle('in', currentValue <= maximumValue)
    bar.classList.toggle('out', currentValue > maximumValue)
  }
}
