// http://blog.thomsonreuters.com/index.php/mobile-patent-suits-graphic-of-the-day/
d3.json("/assets/data/band_info.json", function (band_data){
  var links = band_data;

  var nodes = {};

  // Compute the distinct nodes from the links.
  links.forEach(function(link) {
    link.source = nodes[link.source.name] || (nodes[link.source.name] = link.source);
    link.target = nodes[link.target.name] || (nodes[link.target.name] = link.target);
  });

  var width = window.innerWidth,
      height = window.innerHeight;

  var force = d3.layout.force()
      .nodes(d3.values(nodes))
      .links(links)
      .size([width, height])
      .linkDistance(40)
      .charge(-300)
      .on("tick", tick)
      .start();

  // try to resize the force size when the window is resized.
  window.onresize = function (ev) {
    width = window.innerWidth;
    height = window.innerHeight;
    force.size([width, height]);
  };

  var svg = d3.select("body").append("svg")
      .attr("width", '100%')
      .attr("height", '100%');

  var path = svg.append("g").selectAll("path")
      .data(force.links())
    .enter().append("path")
      .attr("class", function(d) { return "link " + d.type; })
      .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

  var circle = svg.append("g").selectAll("circle")
      .data(force.nodes())
    .enter().append("circle")
      .attr("r", function(d){
        if(d.type === "band"){
          return 12;
        } else {
          return 6;
        }
      })
      .style("fill", "#E54E45")
      .call(force.drag);

  var text = svg.append("g").selectAll("text")
      .data(force.nodes())
    .enter().append("text")
      .attr("x", 8)
      .attr("y", ".31em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.name; });

  // Use elliptical arc path segments to doubly-encode directionality.
  function tick() {
    path.attr("d", linkArc);
    circle.attr("transform", transform);
    text.attr("transform", transform);
  }

  function linkArc(d) {
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy);
    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
  }

  function transform(d) {
    return "translate(" + d.x + "," + d.y + ")";
  }
});
