import ExpertCard from './ExpertCard'

const CardList = (props) => 
{
    return props.experts.map(expert => {
        return <ExpertCard expert={expert} key={expert.id} />
    });
}

export default CardList