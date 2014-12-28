css:
1. 盒子模型
  margin - margin 合并, 百分数参考值
  padding
  border - 三角形等效果
    border-image
    border-radius
  padding
  width - box-sizing(content-box/border-box)
  height
  min-width
  min-height
  max-width
  max-height
  overflow/overflow-x/overflow-y
2. 定位
  position
    static[default]
    relative
    absolute
    fixed
    sticky
  top/right/bottom/left
  z-index
  clip: rect( top right bottom left ); 相对左上角
  clip: inset( top right bottom left ); 相对四个方向
3. Layout/显示
  display: inline/block/none/line-block/flex(box)/inline-flex/table/table-cell
  flex 相关属性
  float, clear(clearfix)
  visibility
  opacity
4. style
  background: color/image/repeat/attachment/position/origin/clip/size
  color/rgb/rgba
  cursor
  outline
  outline-width
  outline-color
  outline-style
  outline-offset
  zoom
  resize
  user-select
5. text
  font: style/size/weight/family/stretch
  text-align
  vertical-align
  text-overflow
  line-height
  text-indent
  text-decoration
  text-shadow
  direction: ltr/rtl
  white-space
6. list
  list-style
  list-style-image
  list-style-position
  list-style-type

7. table
  table-layout
  border-collapse
  border-spacing
  empty-cells

8. content
  content
  counter-increment
  counter-reset
  quotes

9. css3
  transform
  transform-origin

  transition
  transition-property
  transition-duration
  transition-timing-function
  transition-delay

  animation
  animation-name
  animation-duration
  animation-timing-function
  animation-delay
  animation-iteration-count
  animation-direction
  animation-play-state
  animation-fill-mode


https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/HTML-canvas-guide/CreatingGames/CreatingGames.html#//apple_ref/doc/uid/TP40010542-CH17-SW1

http://www.idiotwu.com/study/progress-ring/

// css
input.password-field{
  -webkit-text-security:disc;
}

cursor:
zoom-in
zoom-out
grab
grabbing

http://dabblet.com/
http://dabblet.com/gist/1532242
overflow-x:-webkit-marquee;
-webkit-marquee-speed:slow;
-webkit-marquee-increment:large;
