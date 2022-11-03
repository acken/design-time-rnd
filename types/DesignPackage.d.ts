import { AnyNaptrRecord } from "dns"

type UUID = string
type ActorSceneId = string // already exists
type UniqueProductPath = string
type UseCaseFlowPath = string
type FeatureBehavior = string // already exists¨
type FeatureAction = "fuck u"
type NativeType = string
type ModelPackageId = UUID
type TerminologyCode = {}
type AggregateIdentifierTypes = "uuid" | "int" | "float"

type LinkedObjectType = "UbiquityItem" | "Aggregate"
type FeatureType = "message" | "request-response"



interface ICompleteable {
  completed: boolean
}

interface LinkedObject {
  type: LinkedObjectType
  id: Aggregate["id"] | UbiquityItem["id"]
  textPosition: {
    line: number
    column: number
    length: number
    word: string
  }
}

interface RichText {
  textRepresentation: string
  linkedObjects: LinkedObject[]
}

interface Domain {
  id: UUID 
  parentDomainId?: Domain // change tto refs
  children: { position: 0, domain: Domain | ExternalDomainLink }[]
  title: string
  text: RichText
}

interface ExternalDomainLink {
  uniqueProductPath: UniqueProductPath
  parent?: Domain
  domainId: Domain["id"]
}

interface FeaturePayload {
  cardinality: "single" | "multiple"
  uniquePathToPayload: string 
}

interface ErrorCode {
  uniquePath: string
}

interface Feature extends ICompleteable {
  id: UUID
  title: string
  description: string
  parentUseCaseFlowId: UseCaseFlow["id"] 
  type: FeatureType
  behavior: FeatureBehavior
  action: FeatureAction
  actorCharacters: ActorCharacterFeatureSetup | ActorSceneFeatureSetup 
  input: FeaturePayload
  output?: FeaturePayload
  errorCodes: ErrorCode[]
}

interface UbiquityItem {
  id: UUID
  name: string
  description: string
}

interface ActorCharacterFeatureSetupDetails {
  supported: boolean
  mandatory: boolean
  propertyLink: {
    uniquePathToPayload: string
    propertyName: string
  }
}

interface ActorSceneFeatureSetupDetails {
  supported: ActorSceneId[]
  mandatory: boolean
  propertyLink: {
    uniquePathToPayload: string
    propertyName: string
  }
}

interface ActorCharacterFeatureSetup {
  subject: ActorCharacterFeatureSetupDetails
  responsible: ActorCharacterFeatureSetupDetails
  performer: ActorCharacterFeatureSetupDetails
}

interface ActorSceneFeatureSetup {
  subject: ActorSceneFeatureSetupDetails
  responsible: ActorSceneFeatureSetupDetails
  performer: ActorSceneFeatureSetupDetails
}

interface ActorCharacterSetup {
  subject: boolean
  responsible: boolean
  performer: boolean
}

interface ActorSceneSetup {
  subject: ActorSceneId[]
  responsible: ActorSceneId[]
  performer: ActorSceneId[]
}

interface UseCase {
  id: UUID
  parentDomainId: Domain["id"]
  title: string
  text: RichText
  flows: { position: 0, useCaseFlow: UseCaseFlow }[]
  actorCharacters: ActorCharacterSetup | ActorSceneSetup 
}

interface SubscribedUseCaseFlowLink {
  uniqueProductPath: UniqueProductPath
  useCaseFlowPath: UseCaseFlowPath
}

interface UseCaseFlow {
  id: UUID
  title: string
  text: RichText
  criterias: string[]
  subscriptions: SubscribedUseCaseFlowLink[]
  linkedFeatures: Feature[]
}

interface AggregateIdentifier {
  type: AggregateIdentifierTypes 
}

interface CompositeAggregateIdentifier {
  composite: boolean
  compositePropeties: { position: 0, property: Property }[]
}

type AggregateState = "draft" | "ready-to-complete" | "complete"

interface Aggregate {
  id: UUID
  title: string
  parentDomainId: Domain["id"]
  ubiquityItemId: UbiquityItem["id"]
  identifier: AggregateIdentifier | CompositeAggregateIdentifier
  properties: Property[]
  state: AggregateState
}

interface AggregateReference {
  aggregateId: Aggregate["id"]
}

interface ExternalAggregateReference {
  uniqueProductPath: UniqueProductPath
  uniqueAggregateIdentifierPath: string // TODO util type
}

interface PlatformActorIdReference {
  modelPackageId: ModelPackageId
  typeAliasPath: string
}

interface DraftValueObjectLink {
  draftId: ValueObjectDraft["id"]
}

interface ValueObjectLink {
  modelPackageId: ModelPackageId
  typePath: string
}

interface ValueObjectDraft {
  id: UUID
  parentDomainIdId: Domain["id"]
  title: string
  classification: Property[] | NativeTypeClassification<any, any>
}

interface NativeTypeClassification<T, R> {
  type: NativeType
  sampleData: T 
  validations: R[]
  terminologyCodes?: TerminologyCode[]
}

interface Unclassified {
  children: Property[]
}

/* reference vs link
Reference is either aggregateIdentifier or actorId
Link is either maybe-created typealias or structure
*/

type PropertyClassification = AggregateReference | 
        ExternalAggregateReference | 
        PlatformActorIdReference | 
        DraftValueObjectLink | 
        ValueObjectLink | 
        NativeTypeClassification<any, any> |
        Unclassified // <-- default

interface Property extends ICompleteable {
  id: UUID
  title: string
  classification: PropertyClassification
}

interface DesignProject {
  designPackageId: DesignPackage["id"]
}

interface DesignPackage {
  id: UUID
  domains: Domain[] // OR
  rootDomain: Domain
  ubiquityItems: UbiquityItem[]
  useCases: UseCase[]
  features: Feature[]
  properties: Property[]
  aggregates: Aggregate[]
  valueObjectDrafts: ValueObjectDraft[]
}