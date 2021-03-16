class Component {
  constructor(classDefinition, el, options) {
    // Отображать ошибку, если el является валидным HTML элементом
    if (!(el instanceof Element)) {
      console.error(Error(el + ' is not an HTML Element'));
    }

    // Если существует, уничтожить и повторно инициализировать дочерний элемент
    const ins = classDefinition.getInstance(el);
    if (!!ins) {
      ins.destroy();
    }

    this.$el = el;
  }

  static init(classDefinition, els, options) {
    let instances = null;
    if (els instanceof Element) {
      instances = new classDefinition(els, options);
    } else if (!!els && (els.jquery || els.cash || els instanceof NodeList)) {
      let instancesArr = [];
      for (let i = 0; i < els.length; i++) {
        instancesArr.push(new classDefinition(els[i], options));
      }
      instances = instancesArr;
    }
    return instances;
  }
}

export default class Tooltip extends Component {
  constructor(el, options) {
    super(Tooltip, el, options);
    this.el = el
    this.tooltipEl = null
    this.isOpen = false
    this.isHovered = false
    this.isFocused = false
    this.options = Object.assign({
      margin: 5,
      transitionMove: 10,
      position: 'bottom',
      content: null,
      enterDelay: 200
    }, this.getAttributeOption(), options)
    
    if (this.options.content) {
      this.createToolTip()
      this.setupEventListener()
    }
  }

  static init(els, options) {
    return super.init(this, els, options);
  }

  static getInstance(el) {
    const domElem = !!el.jquery ? el[0] : el;
    return domElem.My_Tooltip;
  }

  createToolTip() {
    const tooltip = document.createElement('div')
    tooltip.classList.add('tooltip')

    this.tooltipEl = tooltip

    const tooltipContent = document.createElement('div')
    tooltipContent.classList.add('tooltip__content')
    tooltipContent.innerHTML = this.options.content

    tooltip.append(tooltipContent)
    document.body.append(tooltip)
  }

  getAttributeOption() {
    const attributeOptions = {}
    const tooltipTextOption = this.el.getAttribute('data-tooltip')
    const positionOption = this.el.getAttribute('data-position')

    if (tooltipTextOption) {
      attributeOptions.content = tooltipTextOption
    }

    if (positionOption) {
      attributeOptions.position = positionOption
    }

    return attributeOptions
  }

  updateTooltipContent() {
    this.tooltipEl.querySelector('.tooltip__content').innerHTML = this.options.content
  }

  show() {
    this.settingPosition()
    this.tooltipEl.style.visibility = 'visible'
    this.tooltipEl.style.transform = `translate(${this.xMove}px, ${this.yMove}px)`
    this.tooltipEl.style.opacity = 1
    this.tooltipEl.style.transition = `opacity ${this.options.enterDelay / 1000}s ease-in, transform ${this.options.enterDelay / 1000}s ease-in`
  }

  hide() {
    this.tooltipEl.style.transform = 'translate(0px, 0px)'
    this.tooltipEl.style.opacity = 0
    this.tooltipEl.style.transition = `opacity ${this.options.enterDelay / 1000}s ease-in, transform ${this.options.enterDelay / 1000}s ease-in`
  }

  setupEventListener() {
    this.handleMouseEnterBind = this.handleMouseenter.bind(this)
    this.handleMouseLeaveBind = this.handleMouseleave.bind(this)
    this.handleFocusBind = this.handleFocus.bind(this)
    this.handleBlurBind = this.handleBlur.bind(this)
    this.el.addEventListener('mouseenter', this.handleMouseEnterBind)
    this.el.addEventListener('mouseleave', this.handleMouseLeaveBind)
    this.el.addEventListener('focus', this.handleFocusBind)
    this.el.addEventListener('blur', this.handleBlurBind)
  }

  removeEventListeners() {
    this.el.removeEventListener('mouseenter', this.handleMouseEnterBind)
    this.el.removeEventListener('mouseleave', this.handleMouseLeaveBind)
    this.el.removeEventListener('focus', this.handleFocusBind)
    this.el.removeEventListener('blur', this.handleBlurBind)
  }

  handleMouseenter() {
    this.isHovered = true
    this.isOpen = true
    this.open(false)
  }

  handleMouseleave() {
    this.isHovered = false
    this.isOpen = false
    this.close()
  }

  handleFocus() {
    this.isFocused = true
    this.isOpen = true
    this.open(false)
  }

  handleBlur() {
    this.isFocused = false
    this.isOpen = false
    this.close()
  }

  pageScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
  }

  pageScrollLeft() {
    return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0
  }

  settingPosition() {
    const origin = this.el
    const tooltip = this.tooltipEl
    const originWidth = origin.offsetWidth
    const originHeight = origin.offsetHeight
    const tooltipWidth = tooltip.offsetWidth
    const tooltipHeight = tooltip.offsetHeight
    const margin = this.options.margin
    let targetTop, targetLeft
    let newCoords = null;

    (this.xMove = 0), (this.yMove = 0)

    targetTop = origin.getBoundingClientRect().top + this.pageScrollTop()
    targetLeft = origin.getBoundingClientRect().left + this.pageScrollLeft()

    if (this.options.position === 'top') {
      targetTop += -tooltipHeight - margin
      targetLeft += originWidth / 2 - tooltipWidth / 2
      this.yMove = -this.options.transitionMove

    } else if (this.options.position === 'right') {
      targetTop += originHeight / 2 - tooltipHeight / 2
      targetLeft += originWidth + margin
      this.xMove = this.options.transitionMove

    } else if (this.options.position === 'left') {
      targetTop += originHeight / 2 - tooltipHeight / 2
      targetLeft += -tooltipWidth - margin
      this.xMove = -this.options.transitionMove

    } else {
      targetTop += originHeight + margin
      targetLeft += originWidth / 2 - tooltipWidth / 2
      this.yMove = this.options.transitionMove
    }

    newCoords = this.repositionWithinScreen(targetLeft, targetTop, tooltipWidth, tooltipHeight)

    tooltip.style.left = newCoords.x + 'px'
    tooltip.style.top = newCoords.y + 'px'
  }

  repositionWithinScreen(x, y, width, height) {
    const scrollLeft = this.pageScrollLeft()
    const scrollTop = this.pageScrollTop()
    let newX = x - scrollLeft
    let newY = y - scrollTop

    const bound = {
      left: newX,
      top: newY,
      width,
      height
    }

    const offset = this.options.margin + this.options.transitionMove
    const edges = this.checkWidthinContainer(document.body, bound, offset)

    if (edges.left) {
      newX = offset
    } else if (edges.right) {
      newX -= newX + width - window.innerWidth
    }

    if (edges.top) {
      newY = offset
    } else if (edges.bottom) {
      newY -= newY + height - window.innerHeight
    }

    return {
      x: newX + scrollLeft,
      y: newY + scrollTop
    }
  }

  checkWidthinContainer(container, bounding, offset) {
    const edges = {
      top: false,
      right: false,
      bottom: false,
      left: false
    }

    const containerRect = container.getBoundingClientRect()
    const containerBottom = container === document.body ? Math.max(container.bottom, window.innerHeight) : containerRect.bottom
    const scrollLeft = container.scrollLeft
    const scrollTop = container.scrollTop

    const scrolledX = bounding.left - scrollLeft
    const scrolledY = bounding.top - scrollTop

    if (scrolledX < containerRect.left + offset || scrolledX < offset) {
      edges.left = true
    }

    if (scrolledX + bounding.width > containerRect.right - offset ||
      scrolledX + bounding.width > window.innerWidth - offset) {
          edges.right = true
    } 

    if (scrolledY < containerRect.top + offset || scrolledY < offset) {
      edges.top = true
    }

    if (scrolledY + bounding.height > containerBottom - offset ||
      scrolledY + bounding.height > window.innerHeight - offset) {
          edges.bottom = true
    }

    return edges
  }

  open(isManual) {
    isManual = isManual === undefined ? true : undefined

    this.isOpen = true
    this.position = this.options.position
    this.updateTooltipContent()
    this.show()
  }

  close() {
    this.isHovered = false
    this.isFocused = false
    this.isOpen = false

    this.hide()
  }

  destroy() {
    if (this.tooltipEl) {
      this.tooltipEl.remove()
      this.removeEventListeners()
      this.el = undefined
    }
  }
}