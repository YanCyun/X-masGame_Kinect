#pragma strict

public static var click_event:String ="";

private var collider_name:String;
private var collider_hover:boolean = false;
private var hover_time:float = 0f;
private var hover_sprite:int = 0;



public var hand_sprite:Sprite[];
public var catch_sprite:Sprite;
public var body:GameObject;
public var left:GameObject;
public var right:GameObject;


function Start () {

}


function Update () {

	Debug.Log(Mathf.Abs(left.transform.position.z - right.transform.position.z));
	//Debug.Log("Body:"+body.transform.position.z);
	//Debug.Log("Hand:"+gameObject.transform.position.z);
	
	if(collider_hover == true){
		hover_time += Time.deltaTime;
		if(hover_time > 0.3){
			hover_time = 0;
			hover_sprite++;
		}
	}
	else{
		hover_sprite = 0;
	}
	
	if(gameObject.transform.position.z - body.transform.position.z > 0.8){
		gameObject.GetComponent(SpriteRenderer).sprite = catch_sprite;
		GameScript.state = GameScript.CATCH;
	}
	if(left.transform.position.z - body.transform.position.z  <= 0.8 && right.transform.position.z - body.transform.position.z <= 0.8){
		gameObject.GetComponent(SpriteRenderer).sprite = hand_sprite[hover_sprite];
		GameScript.state = GameScript.CLICK;
		//if(GameScript.obj_name != "audio") GameScript.obj_name = "";
	}
	
	if(hover_sprite == 8)  {
	
		GameScript.obj_name = collider_name;
		hover_sprite = 0;
		hover_time = 0;
		collider_hover = false;
		collider_name = "";
		
	}
}

function OnTriggerStay2D(other: Collider2D){

	if(GameScript.state == GameScript.CATCH){
		if(GameScript.obj_name == ""){
			if(left.transform.position.z - body.transform.position.z  <= 0.8 && other.name == "bag_right") GameScript.obj_name = other.name;
			if(right.transform.position.z - body.transform.position.z  <= 0.8 && other.name == "bag_left") GameScript.obj_name = other.name;
		} 
			
		Debug.Log(other.name);
	}
	
}
function OnTriggerEnter2D(other: Collider2D) {
	
	if(other.name == "audio" && GameScript.state == GameScript.CLICK){
		collider_hover = true;
		collider_name = other.name;
	}
	//Debug.Log("Enter Other:"+other.name);
}
function OnTriggerExit2D(other: Collider2D) {
	collider_hover = false;
	GameScript.obj_name = "";
	//Debug.Log("Exit Other:"+other.name);
}