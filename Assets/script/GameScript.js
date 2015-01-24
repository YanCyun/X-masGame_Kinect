#pragma strict

public static var state:int = 0;
public static var NOTHING:int = 0;
public static var CLICK:int = 1;
public static var CATCH:int = 2;
public static var obj_name:String = "";

public var question_text:GUIText;
public var bags:GameObject[];//[left,right]
public var chimney:GameObject;
public var hand_right:GameObject;
public var hand_left:GameObject;

//objects[red,orange,yellow,green,blue,purple]
public var candies:Sprite[];
public var balls:Sprite[];
public var pens:Sprite[];

//audio
public var replay:GameObject;
public var bingoClip:AudioClip;
public var bingoClip2:AudioClip;
public var errorClip:AudioClip;
public var nameClip:AudioClip[];
public var firstClip:AudioClip;
public var secondClip:AudioClip;

//object audio
//count
public var countCandyClip:AudioClip[];
public var countBallClip:AudioClip[];
public var countPencilClip:AudioClip[];
//color
public var colorCandyClip:AudioClip[];
public var colorBallClip:AudioClip[];
public var colorPencilClip:AudioClip[];

private var ori_left_pos:Vector2;
private var ori_right_pos:Vector2;

private var mouseDown:boolean = false;
private var mouseOnLeft:boolean = false;
private var mouseOnRight:boolean = false;
private var unAnswer:int;
private var bingo:boolean = false;
private var error:boolean = false;
private var error_time:float = 0f;
private var ani_start:boolean = false;
private var question_audio:boolean = false;
private var firstClip_end:boolean = false;
private var time:float = 0;


private var question_name :String[] = ["Adam","Alice","Becky","Ben","Carter","Charlie","Charlotte",
										"Emily","George","Iris","Jane","John","Katie","Mark","Peter","Serena"];
private var question_type :int = 0;
private var question_count:int;
private var count_string:String[]=["One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"];
private var question_color:String[]= ["red","orange","yellow","green","blue","purple"];
private var question_object:String[]=["candy","ball","pencil"];
private var question_answer:int;
private var question_string:String;

//GUI
private var baseW:float = 1600;
private var baseH:float = 900;
private var scale:Vector3;

public var position_GUI:Rect = new Rect(200,15,200,20);
public var style_GUI:GUIStyle;
public var position_time:Rect = new Rect(200,15,200,20);
public var style_time:GUIStyle;

		

function Start () {
	
	ori_left_pos = bags[0].transform.position;
	ori_right_pos = bags[1].transform.position;

	setQuestion();
	question_audio = true;

}

function Update () {
	
	time += Time.deltaTime;
	
	if(question_audio && time > 1){
		PlayQuestionAudio(firstClip,secondClip);
	}
	
	if(state == CATCH && !bingo){
		mouseDown = true;
		if(obj_name == "bag_right"){
			mouseOnRight = true;
		}
		if(obj_name == "bag_left"){
			mouseOnLeft = true;
		}
	}
	if(state == CLICK){
			if(obj_name == "audio"){
				question_audio = true;
				obj_name == "";
			}
	}
	if(Input.GetMouseButtonDown(0)){
		Debug.Log("MouseDown");
		mouseDown = true;
		if(bags[0].collider2D.OverlapPoint(camera.ScreenToWorldPoint(Input.mousePosition))){
			Debug.Log("MouseDownOnLeftBag");
			mouseOnLeft = true;
		}
		if(bags[1].collider2D.OverlapPoint(camera.ScreenToWorldPoint(Input.mousePosition))){
			Debug.Log("MouseDownOnRightBag");	
			mouseOnRight = true;
		}
		if(replay.collider2D.OverlapPoint(camera.ScreenToWorldPoint(Input.mousePosition))){
				question_audio = true;
		}
	}
	if(Input.GetMouseButtonUp(0) || state == CLICK && mouseDown){
		Debug.Log("MouseUp");
		mouseDown = false;
		
		var start_pos : Vector2 =  GameObject.Find("start").transform.position;
		var end_pos : Vector2 =  GameObject.Find("end").transform.position;
		var hole:boolean = Physics2D.OverlapArea(start_pos,end_pos);
		
		
		
		
		
		if(mouseOnLeft && hole){
			Debug.Log("Left gift in hole");
			
			if(question_answer == 0){
				bingo = true;
				mouseOnLeft = false;
				menu.SCORE += 1;
				obj_name = "";
				AudioSource.PlayClipAtPoint(bingoClip2,transform.position);
				AudioSource.PlayClipAtPoint(bingoClip,transform.position);
			}
			else{
				AudioSource.PlayClipAtPoint(errorClip,transform.position);
				mouseOnLeft = false;
				error = true;
				obj_name = "";
				bags[0].transform.position = ori_left_pos;
			}		
			
		}
		else if(mouseOnRight && hole){
			Debug.Log("Right gift in hole");
			
			if(question_answer == 1){
				bingo = true;
				mouseOnRight = false;
				menu.SCORE += 1;
				obj_name = "";
				AudioSource.PlayClipAtPoint(bingoClip2,transform.position);
				AudioSource.PlayClipAtPoint(bingoClip,transform.position);
			}
			else{
				AudioSource.PlayClipAtPoint(errorClip,transform.position);
				error = true;
				mouseOnRight = false;
				obj_name = "";
				bags[1].transform.position = ori_right_pos;
			}	
		}
		else{
			mouseOnLeft = false;
			mouseOnRight = false;
			obj_name = "";
			bags[0].transform.position = ori_left_pos;
			bags[1].transform.position = ori_right_pos;
		}
		
	}
	if(Input.GetMouseButton(0) && mouseDown || state == CATCH){
		var pos:Vector3;
		
		if(mouseOnLeft){
			pos= hand_left.transform.position;
			bags[0].transform.position = Vector2(pos.x,pos.y);
		}
		if(mouseOnRight){
			pos= hand_right.transform.position;
			bags[1].transform.position = Vector2(pos.x,pos.y);
		}

	}
	
	if(bingo){
		BingoAnimate(question_answer);
	}
	if(error){
		error_time += Time.deltaTime;
		GameObject.Find("banner").renderer.enabled = false;
		GameObject.Find("XX").renderer.enabled = true;
		if(error_time > 0.7) {
			error_time = 0f;
			error = false;
			GameObject.Find("banner").renderer.enabled = true;
			GameObject.Find("XX").renderer.enabled = false;
		}
		
	}
	
}

function setQuestion(){
	
	
	/*
	var Rnd:int = Random.Range(0,16);
	question_string = "The gift for " + question_name[Rnd] + " is";
	firstClip = nameClip[Rnd];
	*/
	question_type = menu.answer_type;
	

	var Rnd_count:int = Random.Range(1,11);
	if(question_type == 0)
		question_string += " "+count_string[Rnd_count-1];

	var Rnd_color = Random.Range(0,6);
	if(question_type == 1)
		question_string += " The "+question_color[Rnd_color];
		
	var Rnd_object = Random.Range(0,3);
	if(Rnd_object != 0 && Rnd_count != 1)
		question_string += " "+question_object[Rnd_object]+"s .";
	else
		question_string += " "+question_object[Rnd_object]+".";
	
		
		
	if(question_type == 0){
		switch(Rnd_object){
			case 0: secondClip = countCandyClip[Rnd_count-1];
					break;
			case 1: secondClip = countBallClip[Rnd_count-1];
					break;
			case 2: secondClip = countPencilClip[Rnd_count-1];
					break;
		}
	}
	else{
		switch(Rnd_object){
			case 0: secondClip = colorCandyClip[Rnd_color];
					break;
			case 1: secondClip = colorBallClip[Rnd_color];
					break;
			case 2: secondClip = colorPencilClip[Rnd_color];
					break;
		}
	}	
		
	question_answer = Random.Range(0,2); 
	Debug.Log(question_string);
	
	
	var answer_String:String = question_answer == 0 ? "left" : "right" ;
	var questions:GameObject[] = GameObject.FindGameObjectsWithTag(answer_String);
	
	var sprite:Sprite;
	
	switch(Rnd_object){
		case 0: sprite = candies[Rnd_color];
				break;
		case 1: sprite = balls[Rnd_color];
				break;
		case 2: sprite = pens[Rnd_color];
				break;
	}
	
	for(var tmp:GameObject in questions){
		var obj : SpriteRenderer = tmp.GetComponent(SpriteRenderer);
		for(var count = 1 ; count <= Rnd_count ; count++){
			if(obj.name == "object"+count){
				obj.sprite = sprite;
				obj.renderer.enabled=true;
			}
		}
	}
	
	
	var e_total:int = question_type == 0 ? Random.Range(1,8) : Rnd_count;
	var e_color:int = question_type == 1 ? Random.Range(0,6) : Rnd_color;
	
	while(e_total == Rnd_count && question_type == 0)
		e_total = Random.Range(1,8);
	
	while(e_color == Rnd_color && question_type ==1)
		e_color = Random.Range(0,6);
		
	switch(Rnd_object){
		case 0: sprite = candies[e_color];
				break;
		case 1: sprite = balls[e_color];
				break;
		case 2: sprite = pens[e_color];
				break;
	}
	
	var error_string = question_answer == 0 ?  "right" : "left" ;
	questions = GameObject.FindGameObjectsWithTag(error_string);
	
	Debug.Log(error_string);
	
	for(var e_tmp:GameObject in questions){
		var e_obj : SpriteRenderer = e_tmp.GetComponent(SpriteRenderer);
		for(var e_count = 1 ; e_count <= e_total ; e_count++){
			if(e_obj.name == "object"+e_count){
				e_obj.sprite = sprite;
				e_obj.renderer.enabled=true;
			}
		}
	}
}

function PlayQuestionAudio(first:AudioClip,second:AudioClip){

	if(!audio.isPlaying && !firstClip_end){
		audio.clip = first;
		audio.Play();
		firstClip_end = true;
	}
	else if(!audio.isPlaying && firstClip_end){
		AudioSource.PlayClipAtPoint(second,transform.position);
		firstClip_end = false;
		question_audio = false;
	}

}
function BingoAnimate(answer:int){	

	var bag:GameObject = answer == 0 ? bags[0] : bags[1];
	if(!ani_start){
	
		GameObject.Find("roof_front").renderer.enabled = true;
		GameObject.Find("OO").renderer.enabled = true;
		GameObject.Find("banner").renderer.enabled = false;
		
		bag.transform.position = Vector3(0,1.2f);
		ani_start = true;
	}
	else{
	
		bag.transform.position.y -= 0.2;
		bag.transform.localScale *= 0.99;

		if(bag.transform.position.y< -10f){
			Application.LoadLevel("level");
		}
	
	}

}
function OnGUI(){

	scale = Vector3(parseFloat(Screen.width)/baseW,parseFloat(Screen.height)/baseH,1);
	var svMat = GUI.matrix;
	GUI.matrix = Matrix4x4.TRS(Vector3.zero, Quaternion.identity, scale);

	if(!bingo && !error){
		GUI.Label(position_GUI,question_string,style_GUI);
		GUI.Label(position_time,menu.GAME_TIME,style_time);
	}
	
	GUI.matrix = svMat;
}