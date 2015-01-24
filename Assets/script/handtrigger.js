#pragma strict

public static var click_event:String ="";

private var collider_name:String;
private var collider_hover:boolean = false;
private var hover_time:float = 0f;
private var hover_sprite:int = 0;



public var hand_sprite:Sprite[];


function Start () {

}


function Update () {
	
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
	
	gameObject.GetComponent(SpriteRenderer).sprite = hand_sprite[hover_sprite];
	
	if(hover_sprite == 8)  {
	
		click_event = collider_name;
		hover_sprite = 0;
		hover_time = 0;
		collider_hover = false;
		collider_name = "";
		
	}
}

function OnTriggerStay2D(other: Collider2D){
	
}
function OnTriggerEnter2D(other: Collider2D) {
	collider_hover = true;
	collider_name = other.name;
	Debug.Log("Enter Other:"+other.name);
}
function OnTriggerExit2D(other: Collider2D) {
	collider_hover = false;
	collider_name = "";
	Debug.Log("Exit Other:"+other.name);
}