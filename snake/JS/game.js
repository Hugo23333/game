window.onload = function(){
  class_game._init();  //页面加载完毕后，执行_init()初始化函数
}

//判断元素是否在数组内
function _in_array(string, array){
  for(var i = 0; i < array.length; i++){
    if(array[i] == string){
      return true;
    }
  }
  return false;
}

//上下左右
document.onkeydown = function(event){
  var _left = 37, _up = 38, _right = 39, _down = 40; //键盘方向键键位值
  var event = event || window.event;
  var _key_value = event.which || event.keyCode;

  switch(_key_value){
    case _left:
      //如果现在向右前进，则按键盘左键无效
      if (class_game._direction != "right") {
        class_game._direction = "left";
      }
      break;
    case _up:
      if (class_game._direction != "down") {
        class_game._direction = "up";
      }
      break;
    case _right:
      if (class_game._direction != "left") {
        class_game._direction = "right";
      }
      break;
    case _down:
      if (class_game._direction != "up") {
        class_game._direction = "down";
      }
      break;
  }
}

var class_game = {
  _column:30,  //行数
  _row:20,  //列数
  _box_width:20,  //画布格子宽度
  _box_hight:20,  //画布格子高度
  _map:[],  //地图数组
  _snake:[],  //蛇
  _snake_x:null,  //随机列数
  _snake_y:null,  //随即行数
  // _food:[],   //食物
  _food_x:null,
  _food_y:null,
  _direction:null,    //方向

  _init:function(){
    this._draw();   //绘制地图、蛇、食物
    this._move();   //移动
  },

  _draw:function(){
    //地图数组
    for (var _x = 0; _x < this._column; _x++) {
      this._map[_x] = [];
      for (var _y = 0; _y < this._row; _y++) {
        this._map[_x][_y] = 0;  //0:空  1:方块
        //console.log("["+_x+","+_y+"]");
      }
    }

    //随机生成蛇和食物的位置
    this._snake_x = Math.floor(Math.random()*this._column);   //随即行数
    this._snake_y = Math.floor(Math.random()*this._row);    //随机列数
    this._food_x = Math.floor(Math.random()*this._column);
    this._food_y = Math.floor(Math.random()*this._row);

    //将随机生成的蛇和食物的位置放入地图数组
    this._map[this._snake_x][this._snake_y] = 1;//1:蛇
    this._map[this._food_x][this._food_y] = 2;//2:食物

    //生成画布
    for (var _x = 0; _x < this._column; _x++) {
      for (var _y = 0; _y < this._row; _y++) {
        var _div = class_base._create('div');

        if (this._map[_x][_y] == 1) {
          //数组从0开始，假设循环至2行2列：二维数组是[1,1]，一维数组是(1*列数+1)=31
          this._snake[0] = _y*this._column+_x;
          _div.setAttribute("class","snake");
        }else if(this._map[_x][_y] == 2) {
          _div.setAttribute("class","food");
        }else{
          _div.setAttribute("class","box");
        }


        //行数18，列数10，数组从0开始，二维转一维公式：一维=y*列数+x，二维坐标[1,1]=1*10+1=11
        _div.setAttribute("id",_y*this._column+_x);
        _div.setAttribute("style","width:"+this._box_width+"px;height:"+this._box_hight+"px;top:"+(this._box_hight*_y)+"px;left:"+(this._box_width*_x)+"px;");
        //console.log(_div);
        //_div.innerHTML = _y*this._column+_x+"<br/>["+_x+","+_y+"]";
        class_base._get('panel').appendChild(_div);
      }
    }
  },

  _move:function(){
    var _init_position = this._snake[0];//原始位置
    var _start_position = this._snake[0];//开始位置
    switch(this._direction){
      //按下方向键以后的开始位置
      case "left":
        _start_position = this._snake[0]-1;
        break;
      case "up":
        _start_position = this._snake[0]-this._column;
        break;
      case "right":
        _start_position = this._snake[0]+1;
        break;
      case "down":
        _start_position = this._snake[0]+this._column;
        break;
    }

    //判断边界
    if ((this._direction == "right" && _start_position%this._column == 0) || (this._direction == "left" && (_start_position+1)%this._column == 0) || (_start_position < 0 || _start_position > this._row*this._column)) {
      alert("Game Over");
      return false;
    }

    //_init_position != _start_position说明是运动状态，非静止
    //判断_start_position是否在数组this._snake内
    if (_init_position != _start_position && _in_array(_start_position,this._snake)) {
      alert("吃到尾巴喽！");
      return false;
    }

    //向数组的开头添加元素
    this._snake.unshift(_start_position);

    //吃食物
    _food_position = this._food_y*this._column+this._food_x;//食物位置
    if (_start_position == _food_position) {
      //随机生成食物位置
      this._food_x = Math.floor(Math.random()*this._column);//随机列数
      this._food_y = Math.floor(Math.random()*this._row);//随即行数
      class_base._get(this._food_y*this._column+this._food_x).setAttribute("class","food");
    }else{
      var _end_position = this._snake.pop();//删除并返回数组的最后一个元素

      //重绘画布格子
      if (_end_position != this._snake[0]) {
        class_base._get(_end_position).setAttribute("class","box");
      }
    }

    //重绘蛇
    for (var _i = 0; _i < this._snake.length; _i++) {
      class_base._get(this._snake[_i]).setAttribute("class","snake");
    }

    //定时器
    setTimeout(function(){
      class_game._move()
    },150);
  }
}

var class_base = {
  //封装document.getElementById
  _get:function(_id){
    return document.getElementById(_id);
  },
  _create:function(_element){
    return document.createElement(_element);
  }
}
