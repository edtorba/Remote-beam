// Words class - stores list of words
function Words() {
    var temp = "breakfast,rich,engaged,proper,talked,respect,fixed,hill,wall,determined,wild,shut,top,plain,scene,sweet,especially,public,acquaintance,forget,history,pale,pray,books,afternoon,man's,otherwise,mention,position,speech,gate,'em,boys,yours,drink,slowly,broke,clothes,fond,pride,watch,sooner,settled,paid,reply,tea,lie,running,died,gentle,particularly,allowed,outside,placed,joy,hearing,note,condition,follow,begin,neck,serious,hurt,kindness,mere,farther,changed,o'clock,passing,girls,force,situation,greater,expression,eat,reading,spoken,raised,anybody,started,following,although,sea,proud,future,quick,safe,temper,laughing,ears,difficulty,meaning,servant,sad,advantage,appear,offer,breath,opposite,number,miserable,law,rising,favour,save,twice,single,blue,noise,stone,mistress,surprised,allow,spot,burst,keeping,line,understood,court,finding,direction,anxious,pocket,around,conduct,loss,fresh,below,hall,satisfaction,land,telling,passion,floor,break,lying,waited,closed,meeting,trying,seat,king,confidence,offered,stranger,somebody,matters,noble,pardon,private";
    this.words = temp.split(',');
};

Words.prototype.getRandomWord = function() {
    if (this.words.length > 0) {
        return this.words[Math.floor(Math.random() * this.words.length)];
    }
    
    return null;
};

module.exports = Words;