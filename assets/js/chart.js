var Chart = {
  init : function(){
    Chart.getData();
  },
  getData: function(){
    d3.json("/datasheetEager", function (band_data){
      if(band_data.length > 0) {
        Chart.drawChart(band_data);
      }
      d3.json("/datasheet", function (band_data){
        if(band_data.new) {
          Chart.drawChart(band_data.data);
        }
      });
    });
  },
  drawChart : function(band_data){

    band_data = convert_band_data(band_data);

    var links = band_data;

    var nodes = {};

    // Compute the distinct nodes from the links.
    links.forEach(function(link) {
      link.source = nodes[link.source.name] || (nodes[link.source.name] = link.source);
      link.target = nodes[link.target.name] || (nodes[link.target.name] = link.target);
    });

    var width = window.innerWidth,
        height = window.innerHeight;

    var zoom_listener = d3.behavior.zoom()
      .scaleExtent([0.1, 3])
      .on("zoom", zoom_handler);

    var force = d3.layout.force()
      .nodes(d3.values(nodes))
      .links(links)
      .size([width, height])
      .linkDistance(100)
      .charge(-300)
      .on("tick", tick)
      .start();

    // try to resize the force size when the window is resized.
    window.onresize = function (ev) {
      width = window.innerWidth;
      height = window.innerHeight;
      force.size([width, height]);
    };

    var svg = d3.select(".chart").append("svg")
      .attr("width", '100%')
      .attr("height", '100%');

    var chart_g = svg.append("g")
      .attr("class", "chart_group");

    function zoom_handler(){
      if(d3.event.sourceEvent.target.tagName === "svg"){
          chart_g.attr("transform", "translate(" + d3.event.translate +
          ") scale(" + d3.event.scale + ")");
        }
      }

    var path = chart_g.append("g").selectAll("path")
        .data(force.links())
      .enter().append("path")
        .attr("class", function(d) { return "link " + d.type; })
        .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

    var circle = chart_g.append("g").selectAll("circle")
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

    zoom_listener(svg);

    var text = chart_g.append("g").selectAll("text")
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

    function convert_band_data (data){
      var result = [];
      _.forEach(data, function (d){
        var new_entry = {
          "source":
            {
              "name": d.member,
              "type": "member"
            },
          "type": d.relationship,
          "target":
            {
              "name": d.memberband,
              "type": d.relationship === "related_to" ? "member" : "band"
            }
          }
        result.push(new_entry);
      });
      return result;
    }
  },

};

Chart.init();