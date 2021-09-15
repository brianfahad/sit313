import Star from '../images/star.png'

const ExpertCard = (props) => 
{ 
    const starRating = [];
    for (var i = 1; i <= props.expert.stars; i++ ) {
      starRating.push(<img src={Star} alt="Star" className="w-6 h-6"/>)
    }
    return (
      <div className="shadow rounded-lg m-8 w-52 flex flex-col">
        <img src={props.expert.image} alt="User" className="w-11/12 mx-auto mt-3 rounded-lg mb-4" />
        <h3 className="text-left ml-4 text-lg font-bold mb-2">{props.expert.first_name + ' ' + props.expert.last_name}</h3>
        <p className="text-left mb-2 mx-4">{props.expert.description}</p>
        <div className="flex ml-4 mt-auto mb-4">
          <p className="text-left mr-2">({props.expert.stars})</p>
          {starRating}
        </div>
      </div>
    )
}

export default ExpertCard