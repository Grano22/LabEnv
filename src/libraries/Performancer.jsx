/*function speedTest(fn) {
    var start = performance.now();
    fn();
    return performance.now() - start;
}

function testSpeed() {
    var sapa = "japa;kurwo;natychmiast;już;japierdole"; var nonie = null;
    let s1 = speedTest(()=>{ nonie = sapa.split(";"); console.log(nonie); });
    let s2 = speedTest(()=>{ nonie = splitByParsing(sapa, ";"); console.log(nonie); });
    return s2 - s1;
}*/